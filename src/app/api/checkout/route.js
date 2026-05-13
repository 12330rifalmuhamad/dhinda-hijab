import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import midtransClient from "midtrans-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Setup Midtrans Core API / Snap
let snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerDetails, cartItems, subtotal, shippingCost, selectedAreaId, courierData, voucherCode } = body;

    // 1. Dapatkan atau buat User
    const session = await getServerSession(authOptions);
    let user;

    if (session && session.user) {
      user = await prisma.user.findUnique({ where: { id: session.user.id } });
    }

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: customerDetails.email }
      });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: customerDetails.email,
            name: customerDetails.name,
            phone: customerDetails.phone,
            password: "guest_" + Math.random().toString(36).substring(7), // Password dummy untuk guest
          }
        });
      }
    }

    // 2. Validasi Voucher (Backend check)
    let finalDiscount = 0;
    let appliedVoucherId = null;

    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode.toUpperCase() }
      });

      if (voucher && voucher.isActive && voucher.stock > 0) {
        const now = new Date();
        if (now >= voucher.startDate && now <= voucher.endDate && subtotal >= voucher.minPurchase) {
          // Check if user already used it
          const alreadyUsed = await prisma.userVoucher.findUnique({
            where: { userId_voucherId: { userId: user.id, voucherId: voucher.id } }
          });

          if (!alreadyUsed || !alreadyUsed.isUsed) {
            if (voucher.type === 'PERCENTAGE') {
              finalDiscount = (subtotal * voucher.discount) / 100;
              if (voucher.maxDiscount && finalDiscount > voucher.maxDiscount) {
                finalDiscount = voucher.maxDiscount;
              }
            } else {
              finalDiscount = voucher.discount;
            }
            if (finalDiscount > subtotal) finalDiscount = subtotal;
            appliedVoucherId = voucher.id;
          }
        }
      }
    }

    const calculatedTotal = Math.max(0, subtotal - finalDiscount) + shippingCost;

    // 3. Buat Order di Database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        subtotal: subtotal,
        shippingCost: shippingCost,
        discount: finalDiscount,
        voucherCode: appliedVoucherId ? voucherCode.toUpperCase() : null,
        totalAmount: calculatedTotal,
        recipientName: customerDetails.name,
        recipientPhone: customerDetails.phone,
        shippingAddress: customerDetails.address,
        shippingAreaId: selectedAreaId,
        courier: courierData?.courier_name,
        shippingService: courierData?.courier_service_name,
        status: "PENDING",
        paymentStatus: "pending",
        items: {
          create: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        }
      }
    });

    // 3. Buat Parameter untuk Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: total
      },
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        shipping_address: {
          first_name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address
        }
      },
      item_details: cartItems.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name.substring(0, 50) // Midtrans memiliki batas karakter untuk nama
      }))
    };

    if (shippingCost > 0) {
      parameter.item_details.push({
        id: 'SHIPPING',
        price: shippingCost,
        quantity: 1,
        name: 'Ongkos Kirim'
      });
    }

    if (finalDiscount > 0) {
      parameter.item_details.push({
        id: 'DISCOUNT',
        price: -finalDiscount, // Discount is negative
        quantity: 1,
        name: 'Diskon Voucher'
      });
    }

    // Update gross amount just to be sure it matches sum of items
    parameter.transaction_details.gross_amount = parameter.item_details.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 4. Request Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;
    const redirectUrl = transaction.redirect_url;

    // 5. Update Order dengan Token
    await prisma.order.update({
      where: { id: order.id },
      data: {
        snapToken: snapToken,
        snapRedirectUrl: redirectUrl
      }
    });

    return NextResponse.json({ 
      success: true, 
      token: snapToken,
      redirectUrl: redirectUrl,
      orderId: order.id 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const data = await request.json();
    
    // 1. Verifikasi Signature Key
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const signatureKey = crypto.createHash('sha512')
      .update(data.order_id + data.status_code + data.gross_amount + serverKey)
      .digest('hex');

    if (signatureKey !== data.signature_key) {
      console.error("Invalid Signature Key");
      return NextResponse.json({ message: 'Invalid signature key' }, { status: 403 });
    }

    // 2. Ambil status transaksi dari Midtrans
    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;
    const orderId = data.order_id;

    let paymentStatus = "pending";
    let orderStatus = "PENDING"; // Status order di Prisma: PENDING, PAID, SHIPPED, dll.

    // 3. Logika penentuan status
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        paymentStatus = 'challenge';
      } else if (fraudStatus === 'accept') {
        paymentStatus = 'success';
        orderStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'success';
      orderStatus = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      paymentStatus = 'failed';
      orderStatus = 'CANCELLED';
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'pending';
    }

    // 4. Update Database
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true }
    });

    if (!existingOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (existingOrder.status === 'PAID' || existingOrder.status === 'SHIPPED' || existingOrder.status === 'DELIVERED') {
      return NextResponse.json({ message: 'Order already processed' });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus,
        status: orderStatus
      }
    });

    // 5. Otomatisasi (Hanya jika sukses)
    if (orderStatus === 'PAID') {
      
      // a. Pengurangan Stok Produk
      for (const item of existingOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // b. Voucher Claim
      if (existingOrder.voucherCode) {
        const voucher = await prisma.voucher.findUnique({
          where: { code: existingOrder.voucherCode }
        });
        
        if (voucher) {
          await prisma.voucher.update({
            where: { id: voucher.id },
            data: { stock: { decrement: 1 } }
          });

          await prisma.userVoucher.upsert({
            where: { userId_voucherId: { userId: existingOrder.userId, voucherId: voucher.id } },
            update: { isUsed: true, usedAt: new Date() },
            create: { userId: existingOrder.userId, voucherId: voucher.id, isUsed: true, usedAt: new Date() }
          });
        }
      }

      // c. Kirim Email Notifikasi
      try {
        await sendOrderConfirmationEmail(existingOrder.user.email, existingOrder);
      } catch (err) {
        console.error("Gagal mengirim email webhook:", err);
      }

      // d. Pembuatan Resi Otomatis (Biteship Create Order)
      if (existingOrder.shippingAreaId && existingOrder.courier) {
        try {
          const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || process.env.NEXT_PUBLIC_BITESHIP_API_KEY;
          const formattedCourier = existingOrder.courier.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          const payload = {
            shipper_contact_name: "Dhinda Hijab Official",
            shipper_contact_phone: "081234567890",
            shipper_contact_email: "noreply@dhindahijab.com",
            shipper_organization: "Dhinda Hijab",
            origin_area_id: "IDNP11IDNC71IDND4870IDNZ12430", // Dummy Gudang
            origin_address: "Gedung Cyber, Jl. Kuningan Barat No.8",
            destination_area_id: existingOrder.shippingAreaId,
            destination_address: existingOrder.shippingAddress,
            receiver_contact_name: existingOrder.recipientName || existingOrder.user.name,
            receiver_contact_phone: existingOrder.recipientPhone || existingOrder.user.phone,
            receiver_contact_email: existingOrder.user.email,
            courier_company: formattedCourier,
            courier_type: existingOrder.shippingService,
            delivery_type: "now",
            order_note: existingOrder.notes || "Mohon di-handle dengan hati-hati",
            items: existingOrder.items.map(i => ({
              name: "Hijab Product",
              value: 100000,
              weight: 200 * i.quantity,
              quantity: i.quantity
            }))
          };

          const biteshipRes = await fetch("https://api.biteship.com/v1/orders", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${BITESHIP_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (biteshipRes.ok) {
            const biteshipData = await biteshipRes.json();
            await prisma.order.update({
              where: { id: orderId },
              data: {
                trackingNumber: biteshipData.courier.tracking_id || biteshipData.courier.waybill_id,
                biteshipOrderId: biteshipData.id,
                waybillUrl: biteshipData.courier.waybill_url
              }
            });
          } else {
            console.error("Biteship Create Order Error:", await biteshipRes.text());
          }
        } catch (biteshipErr) {
          console.error("Failed to create biteship order:", biteshipErr);
        }
      }
    }

    // Opsional: Jika status CANCELLED, kembalikan stok produk (restock)
    // if (orderStatus === 'CANCELLED') {
    //   // Logika restock
    // }

    return NextResponse.json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error("Midtrans Webhook Error:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

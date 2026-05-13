import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();
    const session = await getServerSession(authOptions);

    if (!code) {
      return NextResponse.json({ error: "Kode voucher tidak boleh kosong" }, { status: 400 });
    }

    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!voucher) {
      return NextResponse.json({ error: "Voucher tidak ditemukan" }, { status: 404 });
    }

    if (!voucher.isActive) {
      return NextResponse.json({ error: "Voucher tidak aktif" }, { status: 400 });
    }

    if (voucher.stock <= 0) {
      return NextResponse.json({ error: "Kuota voucher sudah habis" }, { status: 400 });
    }

    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      return NextResponse.json({ error: "Voucher sudah kadaluarsa atau belum bisa digunakan" }, { status: 400 });
    }

    if (subtotal < voucher.minPurchase) {
      return NextResponse.json({ error: `Minimal belanja untuk voucher ini adalah Rp ${voucher.minPurchase.toLocaleString('id-ID')}` }, { status: 400 });
    }

    // Check if user already used it
    if (session?.user?.id) {
      const userVoucher = await prisma.userVoucher.findUnique({
        where: {
          userId_voucherId: {
            userId: session.user.id,
            voucherId: voucher.id
          }
        }
      });

      if (userVoucher && userVoucher.isUsed) {
        return NextResponse.json({ error: "Anda sudah pernah menggunakan voucher ini" }, { status: 400 });
      }
    }

    // Calculate Discount
    let discountAmount = 0;
    if (voucher.type === 'PERCENTAGE') {
      discountAmount = (subtotal * voucher.discount) / 100;
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.type === 'FLAT') {
      discountAmount = voucher.discount;
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return NextResponse.json({ 
      success: true, 
      voucher: { id: voucher.id, code: voucher.code, type: voucher.type, discount: voucher.discount },
      discountAmount 
    });

  } catch (error) {
    console.error("Voucher Validation Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat memvalidasi voucher" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function mapServiceToType(courier, service) {
  if (!courier || !service) return "reg";
  const c = courier.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s = service.toLowerCase();
  
  if (c === 'jne') {
    if (s.includes('yes') || s.includes('yakin')) return 'yes';
    if (s.includes('trucking') || s.includes('jtr') || s.includes('cargo')) return 'jtr';
    return 'reg';
  }
  if (c === 'sicepat') {
    if (s.includes('besok') || s.includes('best')) return 'best';
    if (s.includes('cargo') || s.includes('gokil')) return 'gokil';
    return 'reg';
  }
  if (c === 'jnt') {
    if (s.includes('eco')) return 'eco';
    return 'ez';
  }
  return 'reg';
}

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ message: "Order ID diperlukan" }, { status: 400 });
    }

    // 1. Ambil detail order dari database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (order.status !== 'PAID' && order.status !== 'PENDING') {
      return NextResponse.json({ message: "Hanya pesanan yang sudah PAID/PENDING yang bisa diproses ke kurir" }, { status: 400 });
    }

    // 2. Siapkan data Biteship Create Order
    const courierCompany = order.courier.toLowerCase().replace(/[^a-z0-9]/g, '');
    const courierType = mapServiceToType(order.courier, order.shippingService);

    // Hitung dimensi dan berat items
    const biteshipItems = order.items.map(item => ({
      name: item.product.name.substring(0, 50),
      description: item.product.description?.substring(0, 100) || "Produk Dhinda Hijab",
      value: item.product.price,
      quantity: item.quantity,
      weight: 200 // Asumsi 1 item = 200g
    }));

    const payload = {
      shipper_contact_name: "Dhinda Hijab",
      shipper_contact_phone: "085700800439",
      shipper_contact_email: "info@dhindahijab.com",
      origin_contact_name: "Dhinda Hijab Warehouse",
      origin_contact_phone: "085700800439",
      origin_address: "Cikampek, Karawang, Jawa Barat. 41373", // Menggunakan alamat default gudang admin
      origin_area_id: process.env.BITESHIP_ORIGIN_AREA_ID,
      destination_contact_name: order.recipientName,
      destination_contact_phone: order.recipientPhone,
      destination_contact_email: order.user?.email || "guest@dhindahijab.com",
      destination_address: order.shippingAddress,
      destination_area_id: order.shippingAreaId,
      courier_company: courierCompany,
      courier_type: courierType,
      delivery_type: "pickup", // Otomatis meminta kurir menjemput paket
      items: biteshipItems
    };

    // 3. Panggil API Biteship
    const response = await fetch('https://api.biteship.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BITESHIP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Biteship Create Order Error:", data);
      let errorMessage = data.error || data.message || "Gagal membuat order pengiriman ke Biteship";
      
      if (errorMessage.toLowerCase().includes("key has not been activated")) {
        errorMessage = "Fitur 'Order API' (Request Pickup) belum aktif di akun Biteship Live Anda. Silakan hubungi CS/Support Biteship di support@biteship.com untuk mengaktifkan fitur pembuatan pesanan (Order API), atau gunakan API Key Sandbox (Test) untuk melakukan simulasi pengiriman.";
      }
      
      return NextResponse.json({ 
        message: errorMessage 
      }, { status: response.status === 200 ? 400 : response.status });
    }

    // 4. Simpan nomor resi (waybill_id) dan link cetak label (link) ke database
    const trackingNumber = data.courier?.waybill_id || null;
    const waybillUrl = data.courier?.link || null;
    const biteshipOrderId = data.id || null;

    // Update status order menjadi SHIPPED jika resi sudah digenerate
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
        biteshipOrderId,
        waybillUrl,
        status: trackingNumber ? 'SHIPPED' : 'PAID'
      }
    });

    return NextResponse.json({
      success: true,
      message: "Pickup berhasil di-request!",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Biteship Order Creation API Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

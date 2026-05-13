import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all orders with user and items
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format data for Excel
    const data = orders.map(order => {
      const itemsString = order.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ');
      
      return {
        'ID Pesanan': order.id,
        'Tanggal': new Date(order.createdAt).toLocaleString('id-ID'),
        'Nama Pelanggan': order.user.name || order.recipientName || 'N/A',
        'Email': order.user.email,
        'No. Telepon': order.recipientPhone || 'N/A',
        'Alamat Pengiriman': order.shippingAddress || 'N/A',
        'Kurir': order.courier || 'N/A',
        'Layanan': order.shippingService || 'N/A',
        'No. Resi': order.trackingNumber || '-',
        'Produk': itemsString,
        'Subtotal (Rp)': order.subtotal,
        'Ongkir (Rp)': order.shippingCost,
        'Total (Rp)': order.totalAmount,
        'Status Pembayaran': order.paymentStatus,
        'Status Pesanan': order.status
      };
    });

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    // Generate buffer
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return as downloadable file
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

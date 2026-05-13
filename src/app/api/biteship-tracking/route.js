import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('waybill_id');
    const courier = searchParams.get('courier');

    if (!trackingNumber || !courier) {
      return NextResponse.json({ error: 'waybill_id and courier are required' }, { status: 400 });
    }

    const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || process.env.NEXT_PUBLIC_BITESHIP_API_KEY;

    if (!BITESHIP_API_KEY) {
      // Mock tracking data if no API key is provided
      return NextResponse.json({
        success: true,
        status: "shipped",
        history: [
          { note: "Paket telah diserahkan ke kurir", updated_at: new Date().toISOString(), status: "picked" },
          { note: "Paket sedang dalam perjalanan menuju kota tujuan", updated_at: new Date(Date.now() - 86400000).toISOString(), status: "dropping_off" }
        ]
      });
    }

    // Biteship tracking endpoint
    const response = await fetch(`https://api.biteship.com/v1/trackings/${trackingNumber}/couriers/${courier}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BITESHIP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch tracking' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error tracking shipment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

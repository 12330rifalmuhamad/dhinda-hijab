// src/app/api/biteship-rates/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { destination_area_id, weight = 200 } = await request.json();

    if (!destination_area_id) {
      return NextResponse.json({ message: "ID area tujuan diperlukan" }, { status: 400 });
    }

    const response = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BITESHIP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "origin_area_id": process.env.BITESHIP_ORIGIN_AREA_ID, // Mengambil ID area gudang asal dari .env
        "destination_area_id": destination_area_id,
        "couriers": "jne,sicepat,jnt", // Harus dikirimkan, karena Biteship wajib menerima parameter ini
        "items": [
          {
            "name": "Paket Belanja",
            "description": "Produk fashion",
            "value": 50000,
            "length": 20,
            "width": 15,
            "height": 5,
            "weight": weight // Berat dinamis dalam gram
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Biteship API Error:", data.error || data);
      throw new Error(data.error || 'Gagal mengambil data ongkir dari Biteship');
    }

    return NextResponse.json(data.pricing);

  } catch (error) {
    console.error("Error API Ongkir:", error);
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
// src/app/api/shipping-cost/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { destination, weight, courier } = await request.json();

    if (!destination || !weight || !courier) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'key': process.env.RAJAONGKIR_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // RajaOngkir menggunakan format form, bukan JSON
      body: new URLSearchParams({
        origin: '114', // ID Kota asal (contoh: Jakarta Pusat)
        destination: destination, // ID Kota tujuan
        weight: weight, // Berat dalam gram
        courier: courier, // Kurir (jne, tiki, pos)
      })
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data ongkir dari RajaOngkir');
    }

    const data = await response.json();
    const results = data.rajaongkir.results;

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error API Ongkir:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data ongkir." },
      { status: 500 }
    );
  }
}
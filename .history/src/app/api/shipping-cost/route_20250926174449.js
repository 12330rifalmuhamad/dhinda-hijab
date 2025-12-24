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
      body: new URLSearchParams({
        origin: '152', // ID Kota asal (contoh: Karawang)
        destination: destination,
        weight: weight,
        courier: courier,
      })
    });

    // --- BAGIAN YANG DIPERBARUI ---
    const data = await response.json(); // Ambil responsnya, baik sukses maupun gagal

    if (!response.ok) {
      // Jika gagal, log pesan error dari RajaOngkir
      console.error("RajaOngkir API Error:", data);
      // Kirim pesan error yang lebih spesifik
      const errorMessage = data?.rajaongkir?.status?.description || 'Gagal mengambil data ongkir dari RajaOngkir';
      throw new Error(errorMessage);
    }
    // --- AKHIR BAGIAN YANG DIPERBARUI ---

    const results = data.rajaongkir.results;
    return NextResponse.json(results);

  } catch (error) {
    console.error("Error API Ongkir:", error);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
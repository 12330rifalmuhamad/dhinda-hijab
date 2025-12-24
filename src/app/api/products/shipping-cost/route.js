import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { destination, weight, courier } = await request.json();

    if (!destination || !weight || !courier) {
      return NextResponse.json(
        { message: "Data tidak lengkap. Destination, weight, dan courier diperlukan." }, 
        { status: 400 }
      );
    }

    // Validate courier
    const validCouriers = ['jne', 'tiki', 'pos'];
    if (!validCouriers.includes(courier.toLowerCase())) {
      return NextResponse.json(
        { message: "Kurir tidak valid. Gunakan: jne, tiki, atau pos." },
        { status: 400 }
      );
    }

    // Validate weight (minimum 1 gram)
    if (weight < 1) {
      return NextResponse.json(
        { message: "Berat minimum 1 gram." },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.RAJAONGKIR_API_KEY) {
      return NextResponse.json(
        { message: "API key RajaOngkir tidak dikonfigurasi." },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'key': process.env.RAJAONGKIR_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        origin: '114', // Jakarta Pusat
        destination: destination.toString(),
        weight: weight.toString(),
        courier: courier.toLowerCase(),
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("RajaOngkir API Error:", errorData);
      return NextResponse.json(
        { message: "Gagal mengambil data ongkir dari RajaOngkir." },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (data.rajaongkir.status.code !== 200) {
      return NextResponse.json(
        { message: data.rajaongkir.status.description },
        { status: 400 }
      );
    }

    const results = data.rajaongkir.results;

    // Transform results to include formatted costs
    const transformedResults = results.map(result => ({
      code: result.code,
      name: result.name,
      costs: result.costs.map(cost => ({
        service: cost.service,
        description: cost.description,
        cost: cost.cost.map(c => ({
          value: c.value,
          etd: c.etd,
          note: c.note,
          formattedValue: `Rp ${c.value.toLocaleString('id-ID')}`,
          estimatedDays: c.etd.replace(' HARI', '')
        }))
      }))
    }));

    return NextResponse.json({
      success: true,
      data: transformedResults,
      origin: data.rajaongkir.origin_details,
      destination: data.rajaongkir.destination_details
    });
  } catch (error) {
    console.error("Error API Ongkir:", error);
    return NextResponse.json(
      { 
        message: "Error: Gagal mengambil data ongkir.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Mock shipping cost for development/testing
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courier = searchParams.get('courier') || 'jne';

  // Return mock data for development
  const mockData = {
    success: true,
    data: [
      {
        code: courier,
        name: courier.toUpperCase(),
        costs: [
          {
            service: 'REG',
            description: 'Layanan Reguler',
            cost: [
              {
                value: 15000,
                etd: '2-3 HARI',
                note: '',
                formattedValue: 'Rp 15.000',
                estimatedDays: '2-3'
              }
            ]
          },
          {
            service: 'EXPRESS',
            description: 'Layanan Express',
            cost: [
              {
                value: 25000,
                etd: '1-2 HARI',
                note: '',
                formattedValue: 'Rp 25.000',
                estimatedDays: '1-2'
              }
            ]
          }
        ]
      }
    ]
  };

  return NextResponse.json(mockData);
}
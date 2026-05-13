import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');

    if (!input || input.length < 3) {
      return NextResponse.json({ areas: [] });
    }

    const response = await fetch(`https://api.biteship.com/v1/maps/areas?countries=ID&input=${input}&type=single`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BITESHIP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Gagal mencari area dari Biteship');
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error API Areas:", error);
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { jwtVerify } from "jose";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "secret-key-change-me"
);

async function checkAuth(request) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return false;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role === "ADMIN";
    } catch {
        return false;
    }
}

export async function POST(request) {
    const isAuth = await checkAuth(request);
    if (!isAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { folder = "dhinda_hijab_products" } = body;

        const timestamp = Math.round((new Date).getTime() / 1000);

        const params = {
            timestamp: timestamp,
            folder: folder,
        };

        const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

        return NextResponse.json({
            signature,
            timestamp,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            folder
        });
    } catch (error) {
        console.error("Signature generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate signature" },
            { status: 500 }
        );
    }
}

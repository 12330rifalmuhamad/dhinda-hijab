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
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "application/octet-stream";
    const encoding = "base64";
    const base64Data = buffer.toString(encoding);
    const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri,
        {
          folder: "dhinda_hijab_products",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Cloudinary" },
      { status: 500 }
    );
  }
}

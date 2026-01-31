import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { jwtVerify } from "jose";

// 🚨 Pastikan env wajib ada
if (
  !process.env.JWT_SECRET ||
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing required environment variables");
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Cloudinary config (JS VALID)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔐 Security rules
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
  // 🔐 Auth check
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // 🔒 MIME validation
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    // 🔒 Size limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    // 🔐 Upload IMAGE ONLY
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64}`,
      {
        folder: "dhinda_hijab_products",
        resource_type: "image",
      }
    );

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
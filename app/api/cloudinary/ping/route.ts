export const runtime = "nodejs";

import { NextResponse } from "next/server";

import cloudinary, {
  ensureCloudinaryConfig,
  verifyCloudinaryConnection,
} from "@/lib/cloudinary";

export async function GET() {
  try {
    ensureCloudinaryConfig();

    // Lightweight ping to confirm credentials/connectivity
    const ping = await cloudinary.api.ping();

    return NextResponse.json({ ok: true, ping });
  } catch (error: any) {
    console.error("Cloudinary ping error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Cloudinary ping failed",
        code: error?.http_code,
        cloudinary: error?.name || error?.error || undefined,
      },
      { status: 500 }
    );
  }
}
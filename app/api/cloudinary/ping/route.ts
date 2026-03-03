export const runtime = "nodejs";

import { NextResponse } from "next/server";

import cloudinary, { ensureCloudinaryConfig } from "@/lib/cloudinary";

export async function GET() {
  try {
    ensureCloudinaryConfig();

    // Lightweight ping to confirm credentials/connectivity
    const ping = await cloudinary.api.ping();

    return NextResponse.json({ ok: true, ping });
  } catch (error: unknown) {
    console.error("Cloudinary ping error:", error);

    const err = error as { message?: string; http_code?: number; name?: string; error?: string } | undefined;

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Cloudinary ping failed",
        code: err?.http_code,
        cloudinary: err?.name || err?.error || undefined,
      },
      { status: 500 }
    );
  }
}
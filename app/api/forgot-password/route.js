import { NextResponse } from "next/server";
import crypto from "crypto";

// Dummy user DB (replace with real DB in production)
const users = [
  { email: "test@example.com", id: 1, name: "Test User" },
];

// In-memory store for reset tokens (replace with persistent store in production)
const resetTokens = new Map();

export async function POST(req) {
  const { email } = await req.json();
  const user = users.find((u) => u.email === email);
  if (!user) {
    // Always return success to avoid leaking user existence
    return NextResponse.json({ success: true });
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
  resetTokens.set(token, { userId: user.id, expires });

  // TODO: Send email with reset link (simulate for now)
  console.log(`Password reset link: http://localhost:3000/reset-password?token=${token}`);

  return NextResponse.json({ success: true });
}

// For demonstration, export the resetTokens map (not for production)
export { resetTokens };
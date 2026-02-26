import { NextResponse } from "next/server";
import { resetTokens } from "../forgot-password/route";

// Dummy user DB (replace with real DB in production)
const users = [
  { email: "test@example.com", id: 1, name: "Test User", password: "oldpassword" },
];

export async function POST(req) {
  const { token, password } = await req.json();
  const tokenData = resetTokens.get(token);
  if (!tokenData) {
    return NextResponse.json({ success: false, error: "Token inválido ou expirado." });
  }
  if (Date.now() > tokenData.expires) {
    resetTokens.delete(token);
    return NextResponse.json({ success: false, error: "Token expirado." });
  }
  // Find user and update password (simulate)
  const user = users.find((u) => u.id === tokenData.userId);
  if (!user) {
    return NextResponse.json({ success: false, error: "Usuário não encontrado." });
  }
  user.password = password; // In real app, hash password!
  resetTokens.delete(token);
  return NextResponse.json({ success: true });
}

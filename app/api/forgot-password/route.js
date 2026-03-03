import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

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

  // Build reset URL based on configured app URL or the incoming request origin
  const baseUrl = process.env.APP_URL || req.nextUrl.origin;
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    await sendResetEmail({ to: email, resetUrl, userName: user.name });
  } catch (err) {
    console.error("Failed to send reset email", err);
    return NextResponse.json({ success: false, error: "Falha ao enviar e-mail de redefinição." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// For demonstration, export the resetTokens map (not for production)
export { resetTokens };

async function sendResetEmail({ to, resetUrl, userName }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are missing (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS). ");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = "Redefinição de senha";
  const text = `Olá${userName ? ` ${userName}` : ""},\n\nRecebemos uma solicitação para redefinir sua senha. Clique no link abaixo para continuar:\n${resetUrl}\n\nEste link expira em 15 minutos. Se você não solicitou, ignore este e-mail.`;
  const html = `
    <p>Olá${userName ? ` ${userName}` : ""},</p>
    <p>Recebemos uma solicitação para redefinir sua senha.</p>
    <p><a href="${resetUrl}">Clique aqui para redefinir sua senha</a></p>
    <p>O link expira em 15 minutos. Se você não solicitou, ignore este e-mail.</p>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
}
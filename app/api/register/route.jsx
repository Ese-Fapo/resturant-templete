
import mongoose from "mongoose";
import User from "../../../models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Todos os campos são obrigatórios." }), { status: 400 });
    }

    await mongoose.connect(process.env.MONGODB_URI);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Usuário já cadastrado." }), { status: 409 });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    return new Response(JSON.stringify({ message: "Cadastro realizado com sucesso!" }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao registrar usuário." }), { status: 500 });
  }
}
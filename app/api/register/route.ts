import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/lib/mongoose";

export async function POST(request: Request) {
        try {
                const { name, email, password } = await request.json();

                if (!name || !email || !password) {
                        return NextResponse.json(
                                { error: "Nome, email e senha são obrigatórios." },
                                { status: 400 }
                        );
                }

                await connectDB();

                const normalizedEmail = String(email).trim().toLowerCase();
                const bootstrapAdminEmail = process.env.FIRST_ADMIN_EMAIL?.trim().toLowerCase();

                const existingUser = await User.findOne({ email: normalizedEmail });
                if (existingUser) {
                        return NextResponse.json(
                                { error: "Este email já está cadastrado." },
                                { status: 409 }
                        );
                }

                const hasAnyAdmin = Boolean(await User.exists({ admin: true }));
                const shouldBeBootstrapAdmin =
                        Boolean(bootstrapAdminEmail) &&
                        normalizedEmail === bootstrapAdminEmail &&
                        !hasAnyAdmin;

                const hashedPassword = await bcrypt.hash(password, 10);

                const createdUser = await User.create({
                        name,
                        email: normalizedEmail,
                        password: hashedPassword,
                        admin: shouldBeBootstrapAdmin,
                });

                return NextResponse.json(
                        {
                                message: "Cadastro realizado com sucesso.",
                                user: {
                                        id: createdUser._id,
                                        name: createdUser.name,
                                        email: createdUser.email,
                                },
                        },
                        { status: 201 }
                );
        } catch (error) {
                console.error("Erro ao registrar usuário:", error);
                return NextResponse.json(
                        { error: "Não foi possível completar o cadastro agora." },
                        { status: 500 }
                );
        }
}
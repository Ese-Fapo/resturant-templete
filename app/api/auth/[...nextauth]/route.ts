
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbConnect from "@/lib/mongoose";
import Mongoose from "mongoose";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import user from "@/models/user";

const getMongoClient = async (): Promise<MongoClient> => {
  await dbConnect();
  // Use the same connection string as mongoose
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  return client;
};

const handler = NextAuth({
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;
        const email = credentials.email;
        const password = credentials.password;
        if (!email || !password) return null;
        await dbConnect();
        const foundUser = await user.findOne({ email });
        const isPasswordValid = foundUser && await bcrypt.compare(password, foundUser.password);
        if (isPasswordValid) {
          return { id: foundUser._id, email: foundUser.email };
        }
        return null;
      }
    })
  ],
 
});

export { handler as GET, handler as POST };

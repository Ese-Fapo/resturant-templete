
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";

const handler = NextAuth({
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email } = credentials as { email?: string };

        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGODB_URI || "");
        }

        // TODO: Replace this with real user lookup logic
        const user = { id: "1", name: "J Smith", email };
        return user;
      }
    })
  ]
});

export { handler as GET, handler as POST };

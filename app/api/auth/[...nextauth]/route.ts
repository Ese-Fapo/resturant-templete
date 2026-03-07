import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import connectDB from "@/lib/mongoose";
import User from "@/models/user";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const normalizedEmail = credentials.email.trim().toLowerCase();
        const bootstrapAdminEmail = process.env.FIRST_ADMIN_EMAIL?.trim().toLowerCase();

        const foundUser = await User.findOne({ email: normalizedEmail });
        if (!foundUser) return null;

        if (
          bootstrapAdminEmail &&
          normalizedEmail === bootstrapAdminEmail &&
          !foundUser.admin
        ) {
          const hasAnyAdmin = Boolean(await User.exists({ admin: true }));
          if (!hasAnyAdmin) {
            foundUser.admin = true;
            await foundUser.save();
          }
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          foundUser.password
        );

        if (!isPasswordValid) return null;

        return {
          id: foundUser._id.toString(),
          email: foundUser.email,
          name: foundUser.name,
          phone: foundUser.phone,
          admin: foundUser.admin,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      if (!user.email) return false;

      await connectDB();

      const normalizedEmail = user.email.trim().toLowerCase();
      const bootstrapAdminEmail = process.env.FIRST_ADMIN_EMAIL?.trim().toLowerCase();

      let dbUser = await User.findOne({ email: normalizedEmail });

      if (!dbUser) {
        const hasAnyAdmin = Boolean(await User.exists({ admin: true }));
        const shouldBeBootstrapAdmin =
          Boolean(bootstrapAdminEmail) &&
          normalizedEmail === bootstrapAdminEmail &&
          !hasAnyAdmin;

        const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10);

        dbUser = await User.create({
          name: user.name?.trim() || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          image: user.image || "",
          password: randomPassword,
          admin: shouldBeBootstrapAdmin,
        });
      } else {
        let shouldSave = false;

        if (user.name && user.name !== dbUser.name) {
          dbUser.name = user.name;
          shouldSave = true;
        }

        if (user.image && user.image !== dbUser.image) {
          dbUser.image = user.image;
          shouldSave = true;
        }

        if (
          bootstrapAdminEmail &&
          normalizedEmail === bootstrapAdminEmail &&
          !dbUser.admin
        ) {
          const hasAnyAdmin = Boolean(await User.exists({ admin: true }));
          if (!hasAnyAdmin) {
            dbUser.admin = true;
            shouldSave = true;
          }
        }

        if (shouldSave) {
          await dbUser.save();
        }
      }

      const typedUser = user as {
        id?: string;
        phone?: string | null;
        admin?: boolean;
      };

      typedUser.id = dbUser._id.toString();
      typedUser.phone = dbUser.phone || "";
      typedUser.admin = Boolean(dbUser.admin);

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as {
          id?: string;
          _id?: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
          phone?: string | null;
          admin?: boolean;
        };

        token.id = typedUser.id ?? typedUser._id ?? token.sub;
        token.name = typedUser.name ?? token.name;
        token.email = typedUser.email ?? token.email;
        token.picture = typedUser.image ?? token.picture;
        token.phone = typedUser.phone ?? token.phone;
        token.admin = typedUser.admin ?? false;
        return token;
      }

      // Refresh token data from DB on subsequent calls to reflect profile edits
      if (token.id || token.email) {
        await connectDB();

        const orClauses: Array<Record<string, unknown>> = [];

        if (typeof token.id === "string" && mongoose.isValidObjectId(token.id)) {
          orClauses.push({ _id: token.id });
        }

        if (typeof token.email === "string" && token.email.trim()) {
          orClauses.push({ email: token.email.trim().toLowerCase() });
        }

        const dbUser = orClauses.length
          ? await User.findOne({ $or: orClauses }).lean().exec()
          : null;

        if (dbUser) {
          const typedDbUser = dbUser as {
            _id?: { toString(): string } | string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            phone?: string | null;
            admin?: boolean;
          };

          const idString = typeof typedDbUser._id === "string" ? typedDbUser._id : typedDbUser._id?.toString();

          token.id = idString ?? token.id;
          token.name = typedDbUser.name ?? token.name;
          token.email = typedDbUser.email ?? token.email;
          token.picture = typedDbUser.image ?? token.picture;
          token.phone = typedDbUser.phone ?? token.phone;
          token.admin = typedDbUser.admin ?? false;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const typedToken = token as JWT & { id?: string; admin?: boolean };
        session.user.id = typedToken.id;
        session.user.name = (typedToken.name as string | undefined) ?? session.user.name;
        session.user.email = (typedToken.email as string | undefined) ?? session.user.email;
        session.user.image = (typedToken.picture as string | undefined) ?? session.user.image;
        session.user.phone = (typedToken.phone as string | undefined) ?? session.user.phone;
        session.user.admin = typedToken.admin ?? false;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
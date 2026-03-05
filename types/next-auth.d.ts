import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      name?: string | null;
      phone?: string | null;
      admin?: boolean;
    };
  }

  interface User extends DefaultUser {
    id?: string;
    phone?: string | null;
    admin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string | null;
    admin?: boolean;
  }
}

export {};

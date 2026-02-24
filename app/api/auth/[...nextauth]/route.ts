import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials , req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: credentials?.email }
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ]
});

export { handler as GET, handler as POST };

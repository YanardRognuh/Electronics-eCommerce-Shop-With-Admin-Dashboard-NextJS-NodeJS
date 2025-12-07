// lib/auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findFirst({
            where: { email: credentials.email as string },
          });

          if (user && user.password) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password as string,
              user.password
            );
            if (isPasswordCorrect) {
              return {
                id: user.id,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      return true;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.iat = Math.floor(Date.now() / 1000);
      }
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - (token.iat || now);
      if (tokenAge > 15 * 60) return {};
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 15 * 60,
    updateAge: 5 * 60,
  },
  jwt: {
    maxAge: 15 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;

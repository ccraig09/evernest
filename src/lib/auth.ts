import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { signInSchema } from "./schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For demo purposes, we'll create/find user by email
        // In production, add proper password hashing with bcrypt
        const validatedCredentials = signInSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          console.log(
            "[AUTH] Validation failed:",
            validatedCredentials.error.format(),
          );
          return null;
        }

        const { email } = validatedCredentials.data;
        console.log("[AUTH] Authorizing email:", email);

        let user = await db.user.findUnique({
          where: { email },
        });

        console.log("[AUTH] Existing user found:", !!user);

        // Auto-create user for demo (remove in production)
        if (!user) {
          console.log("[AUTH] Creating new demo user for extra resilience...");
          user = await db.user.create({
            data: {
              email,
              name: email.split("@")[0],
            },
          });
          console.log("[AUTH] User created:", user.id);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("[AUTH] Session callback for user:", token.sub);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("[AUTH] JWT callback for user:", user.id);
        token.sub = user.id;
      }
      return token;
    },
  },
});

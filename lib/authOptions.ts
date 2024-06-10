import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if(!credentials?.email) {
          throw new Error("Email is required");
        }
        if(!credentials?.email) {
          throw new Error("Password is required");
        }
        const data = await sql`SELECT * FROM users WHERE email=${credentials?.email} LIMIT 1`;
        if (!data || data.rowCount === 0) {
          throw new Error("User not found");
        }
        const user = data.rows[0];
        const bcrypt = require("bcrypt")
        const passwordCorrect = await bcrypt.compare(credentials?.password, user.password);
        if (passwordCorrect) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } else {
          throw new Error("Incorrect password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
         // id: token.id, // Assuming token.id exists
          name: token.name,
          email: token.email,
         // image: token.image, // Assuming token.image exists
        };
      }
      return session;
    },
      
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google') {
        const data = await sql`SELECT * FROM users WHERE email=${user.email} LIMIT 1`;
        if (data.rowCount === 0) {
          await sql`INSERT INTO users (name, email) VALUES (${user.name}, ${user.email})`;
        } else {
          console.log("User already exists");
        }
      }
      return true;
    },
  },
};
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import "./types/next-authCustomTypes";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
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
        if (!credentials?.email) {
          throw new Error("Email is required");
        }
        if (!credentials?.password) {
          throw new Error("Password is required");
        }
        const data = await sql`SELECT * FROM users WHERE email=${credentials?.email} LIMIT 1`;
        if (!data || data.rowCount === 0) {
          throw new Error("User not found");
        }
        const user = data.rows[0];
        const bcrypt = require("bcrypt");
        const passwordCorrect = await bcrypt.compare(credentials?.password, user.password);
        if (passwordCorrect) {
          return {
            id: user.id.toString(), 
            name: user.name,
            email: user.email,
            organisationid: user.organisation,
            role: user.role, 
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
        token.role = user.role; // Include the role in the token
      } else if (token.email) {
        // Fetch the role from the database if the token already exists but the role is not set
        const data = await sql`SELECT role FROM users WHERE email=${token.email} LIMIT 1`;
        if (data.rowCount > 0) {
          token.role = data.rows[0].role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id, // Ensure id is a string
          name: token.name,
          email: token.email,
          role: token.role,
        };
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google') {
        const data = await sql`SELECT * FROM users WHERE email=${user.email} LIMIT 1`;
        if (data.rowCount === 0) {
          await sql`INSERT INTO users (name, email, role) VALUES (${user.name}, ${user.email}, 'admin')`;
        } else {
          user.role = data.rows[0].role;
        }
      }
      return true;
    },
  },
};

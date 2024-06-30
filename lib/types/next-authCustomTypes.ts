// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the default User type to include a role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Include the role in the session
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string; // Include the role in the user
  }
}

// Extend the JWT token to include the role
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Include the role in the JWT token
  }
}

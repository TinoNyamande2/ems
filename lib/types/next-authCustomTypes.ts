// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the default User type to include a role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      organisationid:string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    organisationid:string
  }
}

// Extend the JWT token to include the role
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    organisationid:string;
  }
}

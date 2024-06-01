import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import  GithubProvider from "next-auth/providers/github";
import { authOptions } from "../../../../lib/authOptions";
secret:process.env.NEXTAUTH_SECRET

const handler = NextAuth(authOptions);
const { NEXTAUTH_SECRET } = process.env;


export {handler as GET , handler as POST}
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import  GithubProvider from "next-auth/providers/github";
import  CredentialsProviders  from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import { User } from "@/interfaces/user";

export const authOptions:NextAuthOptions = {
  session:{
    strategy:"jwt"

  },
    providers:[
        GoogleProvider({
          clientId:process.env.GOOGLE_CLIENT_ID as string,
          clientSecret:process.env.GOOGLE_CLIENT_SECRET as string
        }),
        GithubProvider({
          clientId:process.env.GITHUB_CLIENT_ID as string,
          clientSecret:process.env.GITHUB_CLIENT_SECRET as string
        }),
        CredentialsProviders({
          name:"Credentials",
          credentials : {
            email :{},
            password:{}
          },
          async authorize(credentials,req) {
            console.log("Loggin in")
            const data = await sql`SELECT * FROM users WHERE email=${credentials?.email} LIMIT 1`
            if(!data || data.rowCount == 0) {
              console.log("User not found")
              return null;
            }
            const user = data.rows[0]
            const bcrypt = require("bcrypt")
            const passwordCorect = await bcrypt.compare(
              credentials?.password,user.password
            )
            if(passwordCorect) {
              console.log("correct password")
              return user?.email;
            }else {
              console.log("Incorrect password")
              return null
            }
          }
        })
]
}
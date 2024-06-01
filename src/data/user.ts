"use server"
import { User } from "@/interfaces/user";
import { NextResponse } from "next/server";
import {sql} from "@vercel/postgres"


export const AddUser = async (user: User) => {
const bcrypt = require('bcrypt')
  try {
    const hashedPassword = await bcrypt.hash(user.password,10)
    await sql`INSERT INTO users (name,email,password) 
    VALUES (${user.name},${user.email},${hashedPassword})`
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getUserByEmail = async (email:string|null|undefined) => {
  try {
    const data = sql`SELECT * FROM users WHERE email=${email}`
    return (await data).rows[0]
  }catch (error) {
    throw new Error((error as Error).message);
  }
}

"use server"
import { User } from "@/interfaces/user";
import { NextResponse } from "next/server";
import {sql} from "@vercel/postgres"


export const AddUser = async (user: User) => {
const bcrypt = require('bcrypt')
  try {
    const hashedPassword = await bcrypt.hash(user.password,10)
    await sql`INSERT INTO users (fullname,email,password) 
    VALUES (${user.fullname},${user.email},${hashedPassword})`
  } catch (error: any) {
    console.log(error);
  }
};

export const UserLogin = async(user:User) =>{

}

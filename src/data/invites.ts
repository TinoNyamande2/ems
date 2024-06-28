"use server";

import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { inviteEmailBody } from "../../templates/forgotpasswordemail";
import { sendMail } from "./email";
import { User } from "@/interfaces/user";



export const createInvite = async (
  toEmail: string,
  from: string | null | undefined,
  organisation: string | undefined
) => {
  try {
    const token = crypto.randomBytes(20).toString("hex");
    const inviteLink = `${process.env.NEXT_PUBLIC_URL}/register?token=${token}`;
    const currentDate = new Date();
    const expiry = new Date(currentDate.setHours(currentDate.getHours() + 1));
    await sql`
      INSERT INTO invite (toemail, fromemail, status, token, organisation, expiry) 
      VALUES (${toEmail}, ${from}, 'NEW', ${token}, ${organisation}, ${expiry.toISOString()})
    `;
    
    const org = await sql`SELECT * FROM organisation WHERE id=${organisation}`;
    const emailMessage = inviteEmailBody(org.rows[0].name, inviteLink, toEmail);

    try {
      await sendMail(toEmail, emailMessage, "Invitation to join Employee Management System");
    } catch (error) {
      throw new Error((error as Error).message);
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const acceptInvite = async (user: User, token: string) => {
  try {
    const bcrypt = require("bcrypt")
    const userExists = await sql`SELECT * FROM users WHERE email=${user.email}`;
    if (userExists.rowCount > 0) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const invite = await sql`SELECT * FROM invite WHERE token=${token} LIMIT 1`;
    if (invite.rowCount === 0) {
      throw new Error("Invalid invite link");
    }

    const expiryDate = new Date(invite.rows[0].expiry);
    const currentDate = new Date();
    if (expiryDate.getTime() < currentDate.getTime()) {
      console.log(expiryDate.getTime())
      console.log(currentDate.getTime())
      throw new Error("Invite link has expired");
    }

    await sql`
      INSERT INTO users (name, email, password, role, organisation) 
      VALUES (${user.name}, ${invite.rows[0].toemail}, ${hashedPassword}, 'user', ${invite.rows[0].organisation})
    `;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

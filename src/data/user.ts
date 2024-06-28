"use server";
import { User } from "@/interfaces/user";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { sendMail } from "./email";
import { forgotPasswordEmailBody } from "../../templates/forgotpasswordemail";
////    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

export const AddUser = async (user: User) => {
  const bcrypt = require("bcrypt");
  try {
    const userExists = await sql`SELECT * FROM users WHERE email=${user.email}`;
    if (userExists.rowCount > 0) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await sql`INSERT INTO users (name,email,password,role) 
    VALUES (${user.name},${user.email},${hashedPassword},'admin')`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getUserByEmail = async (email: string | null | undefined) => {
  try {
    const data = sql`SELECT a.id as userid,a.email as useremail, a.role as role, a.name as username,b.name ,b.name AS organisationname,b.id as organisationid FROM users a JOIN organisation b ON a.organisation::uuid = b.id WHERE email=${email}`;
    return (await data).rows[0];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addOrganisationToUser = async (
  username: string | null | undefined,
  id: string | undefined
) => {
  try {
    await sql`UPDATE users SET organisation=${id} WHERE email=${username}`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const createForgotPasswordResetLink = async (email: string) => {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (user.rowCount == 0) {
      throw new Error("Email not found");
    }
    const token = crypto.randomBytes(20).toString("hex");
    const resetLink = `${process.env.NEXT_PUBLIC_URL}/forgot-password?token=${token}`;
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    await sql`INSERT INTO forgotpassword (email,token,tokenexpiry,status) VALUES (${email},${token},${currentTime.toISOString()},'REQ')`;
    const emailMessage = forgotPasswordEmailBody(user.rows[0].name, resetLink);
    await sendMail(email, emailMessage, "Password reset ");
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const verifyPasswordResetToken = async (token: string) => {
  try {
    const data = await sql`SELECT * FROM forgotpassword WHERE token = ${token}`;
    if (data.rowCount == 0) {
      throw new Error("Invalid link");
    } else {
      return data.rows[0];
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);
    const data =
      await sql`SELECT * FROM forgotpassword WHERE token = ${token} AND status = 'REQ' LIMIT 1`;
    if (data.rowCount == 0) {
      throw new Error("Invalid reset link");
    }
    const currentDate = new Date();
    const expiryDate = new Date(data.rows[0].tokenexpiry);
    if (currentDate > expiryDate) {
      throw new Error("Link has expired . Please generate a new one");
    }
    await sql`UPDATE users SET password = ${hashedPassword} WHERE email=${data.rows[0].email}`;
    await sql`UPDATE forgotpassword SET status='DONE' WHERE token=${token}`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const changePassword = async (
  useremail: string | null | undefined,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const bcrypt = require("bcrypt");
    const user = await sql`SELECT * FROM users WHERE email =${useremail}`;
    if (user.rowCount == 0) {
      throw new Error("Error retrieving user data");
    }
    if (user.rows[0].password == null) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await sql`UPDATE users SET password=${hashedPassword} WHERE email=${useremail}`;
      return;
    }
    const passwordCorrect = await bcrypt.compare(
      oldPassword,
      user.rows[0].password
    );
    if (!passwordCorrect) {
      throw new Error("Incorrect password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password=${hashedPassword} WHERE email=${useremail}`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

import { sql } from "@vercel/postgres";
import crypto from "crypto";

export const sendMail = async (toEmail: string,message:string,subject:string) => {
  try {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject: subject,
      html:message,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
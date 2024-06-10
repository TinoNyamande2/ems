"use server"
import { NotificationCreate } from "@/interfaces/notification"
import {sql} from "@vercel/postgres"

export const createNotification = async(notification:NotificationCreate) =>{
    try {
         await sql`INSERT INTO notifications (applicationid,"to","from",date,read,message) VALUES (${notification.applicationid},${notification.to},${notification.from},${notification.date},${false},${notification.message})`
    }catch(error) {
        throw new Error((error as Error).message);
          }  
}
export const updateNotification = async (id:string) =>{
    try {
      await sql`UPDATE notifications SET read=${true} WHERE id=${id}`
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}
export const deleteNotification = async (id:string) =>{
    try {
      await sql`DELETE FROM notifications WHERE id=${id}`
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}
export const getNotificationsByUsername = async(username:string|null|undefined) =>{
  try {
    const data = await sql`SELECT * FROM notifications WHERE "to"=${username} `
    return  data.rows
  }catch(error) {
    throw new Error((error as Error).message);
      }  
}
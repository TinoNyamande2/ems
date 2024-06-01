"use server" 
import { PerfomanceCreate } from "@/interfaces/performance"
import {sql} from "@vercel/postgres"

export const addPerformance = async(performance:PerfomanceCreate) =>{
  try {
    await sql`INSERT INTO performance (starttime,endtime,totalhours,date,project,tags,summary,username)
    VALUES (${performance.starttime},${performance.endtime},${performance.totalhours},
        ${performance.date},${performance.project} ,${performance.tags},${performance.summary},${performance.username}
    )`
  }catch (error) {
    throw new Error((error as Error).message);
  }
}
export const getPerformanceFromWeekByUsername = (username:string) =>{

}
export const getPerformanceForDayByUsername = async (username:string|null|undefined,date:string) =>{
  console.log("Searching")
      try {
        console.log(username)
        console.log(date);
        const data = await sql`SELECT * FROM performance WHERE username=${username} AND date=${date}`
        console.log(data.rowCount);
        return data.rows
        console.log(data);
      }catch (error) {
        throw new Error((error as Error).message);
      }
}
export const getPerformanceById = (id:string) =>{

}
export const editPerformance = (id:string) =>{

}
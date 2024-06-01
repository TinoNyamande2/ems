"use server" 
import { PerfomanceCreate } from "@/interfaces/performance"
import {sql} from "@vercel/postgres"

export const addPerformance = async(performance:PerfomanceCreate) =>{
  try {
    await sql`INSERT INTO performance (starttime,endtime,totalhours,date,project,tags,summary)
    VALUES (${performance.starttime},${performance.endtime},${performance.totalhours},
        ${performance.date},${performance.project} ,${performance.tags},${performance.summary}
    )`
  }catch (error) {
    throw new Error((error as Error).message);
  }
}
export const getPerformanceFromWeekByUsername = (username:string) =>{

}
export const getPerformanceById = (id:string) =>{

}
export const editPerformance = (id:string) =>{

}
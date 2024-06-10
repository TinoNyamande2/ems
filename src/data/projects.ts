"use server"
import {sql} from "@vercel/postgres"
export const createProject = async (projectname:string) =>{
    try {
        await sql`INSERT INTO projects(projectname) VALUES (${projectname})`
    }catch(error) {
  throw new Error((error as Error).message);
    }
}
export const deleteProject = async (id:string) =>{
    try {
        await sql`DELETE FROM projects WHERE id=${id}`
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}
export const editProject = async (id:string,projectname:string) =>{
    try {
        await sql`UPDATE projects SET projectname=${projectname} WHERE id=${id}`
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}
export const getProjectById = async (id:string) =>{
    try {
        const data = await sql`SELECT * FROM projects WHERE id=${id} LIMIT 1`
        return data.rows[0]
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}

export const getAllProjects = async () =>{
    try {
        const data = await sql`SELECT * FROM projects`
        return data.rows
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}

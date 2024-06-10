"use server"
import {sql} from "@vercel/postgres"
export const createTags = async (tagname:string) =>{
    try {
        await sql`INSERT INTO tags(tagname) VALUES (${tagname})`
    }catch(error) {
  throw new Error((error as Error).message);
    }
}
export const deleteTag = async (id:string) =>{
    try {
        await sql`DELETE FROM tags WHERE id=${id}`
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}
export const editTag = async (id:string,tagname:string) =>{
    try {
        await sql`UPDATE tags SET tagname=${tagname} WHERE id=${id}`
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}
export const getTagById = async (id:string) =>{
    try {
        const data = await sql`SELECT * FROM tags WHERE id=${id} LIMIT 1`
        return data.rows[0]
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}

export const getAllTags = async () =>{
    try {
        const data = await sql`SELECT * FROM tags`
        return data.rows
    }catch(error) {
  throw new Error((error as Error).message);
    }  
}

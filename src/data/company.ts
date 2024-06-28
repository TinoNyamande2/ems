"use server"
import { CompanyCreate, CompanyEdit } from "@/interfaces/company";
import { sql } from "@vercel/postgres";
import { addOrganisationToUser } from "./user";

export const createCompany =  async(company:CompanyCreate)=>{
    try {
         const vals = await sql`INSERT INTO organisation (
            name,
            userid
        )
            VALUES (
               ${company.name},
               ${company.userid}
            ) RETURNING *`
             await addOrganisationToUser(company.userid ,vals.rows[0].id)
             return vals.rows[0]
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
export const editCompany = async(company:CompanyEdit) =>{
    try {
          await sql`UPDATE organisation SET 
          companyName=${company.name}
          `
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
export const deleteCompany = async(id:string) =>{
    try {
        await sql`DELETE FROM organisation WHERE id=${id}`
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
export const getCompanyDetails = async(id:string) =>{
    try {
        const data = await sql`SELECT * FROM organisation WHERE id=${id}`
        return data.rows[0]
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};

export const getCompanyByEmail = async(email:string|null|undefined) =>{
    try {
        const data = await sql`SELECT * FROM organisation WHERE userid=${email} LIMIT 1`
        return data.rows[0]
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};

export const getCompanyForUser = async(email:string|null|undefined) =>{
    try {
        const data = await sql`SELECT * FROM organisation WHERE userid=${email} LIMIT 1`
        return data.rows[0]

    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
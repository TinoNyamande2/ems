import { CompanyCreate, CompanyEdit } from "@/interfaces/company";
import { sql } from "@vercel/postgres";

export const createCompany =  async(company:CompanyCreate)=>{
    try {
        await sql`INSERT INTO company (
            companyname,
            userid,
            phone,
            whatsapp,
            facebook,
            address ,
            email
        )
            VALUES (
               ${company.companyname},
               ${company.userid},
               ${company.phone},
               ${company.whatsapp},
               ${company.facebook},
               ${company.address},
               ${company.email}
            )`
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
export const editCompany = async(company:CompanyEdit) =>{
    try {
          await sql`UPDATE company SET 
          companyName=${company.companyname},
          facebook=${company.facebook},
          whatsapp=${company.whatsapp},
          phone=${company.phone},
          address=${company.address},
          email=${company.email}
          `
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
export const deleteCompany = async(id:string) =>{
    try {
        await sql`DELETE FROM company WHERE id=${id}`
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
export const getCompanyDetails = async(id:string) =>{
    try {
        const data = await sql`SELECT * FROM company WHERE id=${id}`
        return data.rows[0]
    }catch(error) {
        throw new Error ((error as Error).message)
    }
};
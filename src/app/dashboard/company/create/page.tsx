"use client"
import { CompanyCreate, CompanyCreateDefaultValues } from "@/interfaces/company"
import { ChangeEvent, useState } from "react"

export default function Page () {
    const [inputs,setInputs] = useState<CompanyCreate>(CompanyCreateDefaultValues);
    const handleChange = (event:ChangeEvent<HTMLInputElement>) =>{
        setInputs((prevInputs)=>({...prevInputs,[event.target.name]:event.target.value}))
    }
    return (
        <form>
            <label htmlFor="companyname"  >Company Name</label>
            <input onChange={handleChange} name="companyname" />
            <label htmlFor="address">Address</label>
            <input onChange={handleChange} name="address" />
            <label htmlFor="phone" >Phone Number</label>
            <input onChange={handleChange} name="phone" />
            <label htmlFor="whatsapp" >Whatsap Number</label>
            <input onChange={handleChange} name="whatsapp" />
            <label htmlFor="facebook" >Facebook Link</label>
            <input onChange={handleChange} name="facebook" />
            <label htmlFor="email" >Email</label>
            <input onChange={handleChange} name="email" />
        </form>
    )
}
export interface CompanyCreate {
     companyname:string,
     userid:string,
     phone:string,
     whatsapp:string,
     facebook:string,
     address: string,
     email:string

}

export interface CompanyEdit {
    id:string,
    companyname:string,
    userid:string,
    phone:string,
    whatsapp:string,
    facebook:string,
    address: string,
    email:string

}

export const CompanyCreateDefaultValues :CompanyCreate=  {
    companyname:"",
    userid:"",
    phone:"",
    whatsapp:"",
    facebook:"",
    address: "",
    email:""

}

export const CompanyEditDefaultValues:CompanyEdit = {
    id:"",
   companyname:"",
   userid:"",
   phone:"",
   whatsapp:"",
   facebook:"",
   address: "",
   email:""

}
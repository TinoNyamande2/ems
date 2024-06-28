export interface CompanyCreate {
     name:string,
     userid:string|undefined|null,
 

}

export interface CompanyEdit {
    id:string,
    name:string,
    userid:string
}

export const CompanyCreateDefaultValues :CompanyCreate=  {
    name:"",
    userid:"",
}

export const CompanyEditDefaultValues:CompanyEdit = {
    id:"",
   name:"",
   userid:"",
 

}
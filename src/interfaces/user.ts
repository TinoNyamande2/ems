export interface User {
    name :string,
    email:string,
    password:string,
    confirmpassword:string,
}

export const UserDefaultValues :User = {
    name :"",
    email:"",
    password:"",
    confirmpassword:""
}
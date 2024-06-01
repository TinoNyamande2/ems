export interface User {
    name :string,
    email:string,
    password:string
}

export const UserDefaultValues :User = {
    name :"",
    email:"",
    password:""
}
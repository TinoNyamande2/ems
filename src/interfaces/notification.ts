export interface NotificationCreate {
    to:string,
    from:string|null|undefined,
    date:string,
    read:boolean,
    message:string,
    applicationid:string,
    organisation:string|null|undefined
}

export const NotificationDefaultValues:NotificationCreate = {
    to:"",
    from :"",
    date:"",
    read:false,
    message:"",
    applicationid:"",
    organisation:""
}
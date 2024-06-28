export interface LeaveApplicationCreate  {
    username : string | null |undefined,
    startdate: string,
    enddate:string,
    totaldays:string,
    leavetype:string,
    status:string,
    applicationdate:string,
    organisationid:string|null|undefined
}

export const LeaveApplicationCreateDefaultValues:LeaveApplicationCreate = {
    username : "",
    startdate: "",
    enddate:"",
    totaldays:"",
    leavetype:"",
    status:"",
    applicationdate:"",
    organisationid:""
}

export interface LeaveApplicationEdit  {
    id:string,
    username : string,
    startdate: string,
    enddate:string,
    totaldays:string,
    leavetype:string,
    status:string,
    applicationdate:string,

}

export const LeaveApplicationEditDefaultValues:LeaveApplicationEdit = {
    id:"",
    username : "",
    startdate: "",
    enddate:"",
    totaldays:"",
    leavetype:"",
    status:"",
    applicationdate:"",

}

export interface Leavebalances {
    username:string,
    leavebalance:string
}
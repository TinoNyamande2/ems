export interface PerfomanceCreate {
   starttime:string,
   endtime:string,
   totalhours:string,
   date:string,
   project:string,
   tags:string,
   summary:string,
   username:string|undefined|null,
   organisation:string|undefined|null,
}

export const PerfomanceCreateDefaultValues : PerfomanceCreate = {
    starttime:"",
    endtime:"",
    totalhours:"",
    date:"",
    project:"",
    tags:"",
    summary:"",
    username:"",
    organisation:""
 }

 export interface PerfomanceEdit {
    id:string,
    starttime:string,
    endtime:string,
    totalhours:string,
    date:string,
    project:string,
    tags:string,
    summary:string,
    username:string,
 }
 
 export const PerfomanceEditDefaultValues : PerfomanceEdit = {
    id:"",
     starttime:"",
     endtime:"",
     totalhours:"",
     date:"",
     project:"",
     tags:"",
     summary:"",
     username:""
  }
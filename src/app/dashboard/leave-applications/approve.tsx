import { getAllNewApplication, getApplicationByUsername } from "@/data/leaveapplications";
import { QueryResultRow } from "@vercel/postgres";
import { useState, useEffect } from "react";
import LeaveTable from "./tabledata";

export default function Approve () {
    
    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    useEffect(() => {
        const getData = async () => {
                const data = await getAllNewApplication();
                setApplications(data);
            
        }
        getData();
    }, [])
    return (
        <>
        {applications ? (<LeaveTable applications={applications}/>):(<p>No data found</p>)}
        
        </>
    )
}
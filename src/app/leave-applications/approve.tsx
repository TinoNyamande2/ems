import { getAllNewApplication, getApplicationByUsername } from "@/data/leaveapplications";
import { QueryResultRow } from "@vercel/postgres";
import { useState, useEffect } from "react";
import LeaveTable from "./tabledata";
import { NoDataFound } from "../../../components/NoDataFound";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { ErrorOccured } from "../../../components/ErrorOccured";

export default function Approve () {
    
    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const getApplications = ()=>getAllNewApplication();
    const { data, isError, isLoading ,error} = useQuery([ 'new-leave-applications'],getApplications,);
    useEffect(() => {
        if (!isLoading && data) {
            setApplications(data);
          }
    }, [data,isLoading])
    if(isLoading) {
         return <CircularProgressSpinner message="Loading Applications"/>
    }
    if (isError) {
        return (
            <ErrorOccured message={(error as Error).message} />
        )
    }
    return (
        <>
        {applications && !isLoading ? (<LeaveTable applications={applications}/>):(<NoDataFound message={"There are currentl no applications pending approval"}/>)}
        
        </>
    )
}
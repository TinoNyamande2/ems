"use client"
import { useEffect, useState } from "react"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername, getLatestApplications } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { SmallCircularProgressSpinner } from "./CircularProgress";
import LeaveTable, { LeaveTableForDashboard } from "@/app/leave-applications/tabledata";
import { ErrorOccured } from "./ErrorOccured";
import { NoDataFound } from "./NoDataFound";


export default function LatestApplications() {

    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const getApplications = () => getLatestApplications();
    const { data, isError, isLoading, error } = useQuery(
        ['latest-applications', 'leave-applications'],getApplications);
    useEffect(() => {
        if (!isLoading && data) {
            setApplications(data);
        }
    }, [ data, isLoading])
    if (isLoading) {
        return <SmallCircularProgressSpinner message="Loading Applications" />
    }
    if (isError) {
        return (
            <ErrorOccured message={(error as Error).message} />
        )
    }

    return (
        <>
            {applications && !isLoading ? (<LeaveTableForDashboard applications={applications} />
            ) : (<NoDataFound message={"No applications found"} />)}
        </>
    )
}
"use client"
import { useEffect, useState } from "react"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername, getLatestApplications, getOnLeaveApplications } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { SmallCircularProgressSpinner } from "../misc/CircularProgress";
import LeaveTable, { LeaveTableForDashboard, OnLeaveTableForDashboard } from "@/app/leave-applications/tabledata";
import { ErrorOccured } from "../misc/ErrorOccured";
import { NoDataFound } from "../misc/NoDataFound";


export default function LatestApplications({organisation}:{organisation:string|null|undefined}) {

    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const getApplications = () => getLatestApplications(organisation);
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

export const OnLeaveApplications = ({organisation}:{organisation:string|null|undefined})=> {

    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const { data, isError, isLoading, error } = useQuery(
        ['on-leave-applications', 'leave-applications'],()=>getOnLeaveApplications(organisation));
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
            {applications && !isLoading ? (<OnLeaveTableForDashboard applications={applications} />
            ) : (<NoDataFound message={"No applications found"} />)}
        </>
    )
}
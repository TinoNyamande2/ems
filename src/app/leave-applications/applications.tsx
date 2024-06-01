"use client"
import { useEffect, useState } from "react"
import LeaveTable from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { NoDataFound } from "../../../components/NoDataFound";
import { ErrorOccured } from "../../../components/ErrorOccured";

export default function Applications() {
    const { data: session } = useSession();
    const username = session?.user?.name;

    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const getApplications = () => getApplicationByUsername(username)
    const { data, isError, isLoading, error } = useQuery(
        [username, 'leave-applications'],
        getApplications,
        {
            enabled: !!username,
        }
    );
    useEffect(() => {
        if (!isLoading && data) {
            setApplications(data);
        }
    }, [session, data, isLoading])
    if (isLoading) {
        return <CircularProgressSpinner message="Loading Applications" />
    }
    if (isError) {
        return (
            <ErrorOccured message={(error as Error).message} />
        )
    }

    return (
        <>
            {applications && !isLoading ? (<LeaveTable applications={applications} />
            ) : (<NoDataFound message={"You dont have any leave applicatios"} />)}
        </>
    )
}
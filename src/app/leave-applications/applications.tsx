"use client"
import { useEffect, useState } from "react"
import LeaveTable, { LeaveTableDetails } from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { NoDataFound } from "../../../components/NoDataFound";
import { ErrorOccured } from "../../../components/ErrorOccured";
import { Box, Typography } from "@mui/material";

export default function Applications() {
    const { data: session } = useSession();
    const username = session?.user?.email;

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
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >My Leave Applications</Typography>
            </Box>
            {applications && applications?.length > 0 && !isLoading ? (<LeaveTableDetails applications={applications} />
            ) : (<NoDataFound message={"You dont have any leave applicatios"} />)}
        </>
    )
}
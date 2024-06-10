"use client"
import { useEffect, useState } from "react"
import LeaveTable, { LeaveTableDetails, PendingLeaveTableDetails } from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername, getPendingApplicationByUsername } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { NoDataFound } from "../../../components/NoDataFound";
import { ErrorOccured } from "../../../components/ErrorOccured";
import { Box, Typography } from "@mui/material";

export default function PendingApplications() {
    const { data: session } = useSession();
    const username = session?.user?.email;

    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const getApplications = () => getPendingApplicationByUsername(username)
    const { data, isError, isLoading, error } = useQuery(
        [username, 'pending-leave-applications'],
        getApplications,
        {
            enabled: !!username,
        }
    );
    useEffect(() => {
        if (!isLoading && data) {
            setApplications(data);
            console.log(data)
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
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >My Pending Applications</Typography>
            </Box>
            {applications && applications?.length > 0 && !isLoading ? (<PendingLeaveTableDetails applications={applications} />
            ) : (<NoDataFound message={"You dont have any pending leave applicatios"} />) }
        </>
    )
}
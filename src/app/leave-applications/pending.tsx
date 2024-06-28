"use client"
import { useEffect, useState } from "react"
import LeaveTable, { LeaveTableDetails, PendingLeaveTableDetails } from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername, getPendingApplicationByUsername } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { NoDataFound } from "../../../components/misc/NoDataFound";
import { ErrorOccured } from "../../../components/misc/ErrorOccured";
import { Box, Typography } from "@mui/material";

export default function PendingApplications({username,organisation}:{username:string|undefined|null,organisation:string|undefined|null} ) {
    
    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const getApplications = () => getPendingApplicationByUsername(username,organisation)
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
        }
    }, [username, organisation, isLoading])
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
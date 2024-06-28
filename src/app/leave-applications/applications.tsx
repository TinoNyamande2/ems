"use client"
import { useEffect, useState } from "react"
import LeaveTable, { LeaveTableDetails } from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername, getFilteredApplicationsForUser } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { NoDataFound } from "../../../components/misc/NoDataFound";
import { ErrorOccured } from "../../../components/misc/ErrorOccured";
import { Box, Typography } from "@mui/material";
import UserSearch from "./usersearch";
import { useSearchParams } from "next/navigation";
import { UserPieChart } from "./userPieChart";

export default function Applications({ username, organisation }: { username: string | null | undefined, organisation: string | null | undefined }) {

    const searchParams = useSearchParams();
    const from = searchParams.get('from') || "";
    const to = searchParams.get("to") || "";
    const leavetype = searchParams.get("leavetype") || "";
    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const getApplications = () => getFilteredApplicationsForUser(username, leavetype, organisation, to, from)
    const { data, isError, isLoading, error } = useQuery(
        [username, organisation, leavetype, from, to, 'leave-applications'],
        getApplications,
        {
            enabled: !!username,
        }
    );
    useEffect(() => {
        if (!isLoading && data) {
            setApplications(data);
        }
    }, [username, organisation, data, isLoading, from, to, leavetype])
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
            <Box sx={{ marginTop: "3vh",marginBottom:"5vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >My Leave Applications</Typography>
            </Box>
            <Box sx={{ paddingTop: "3vh", width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "5vh" }}>
                <UserSearch placeholder="" />
            </Box>
            <Box sx={{ paddingTop: "3vh", width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "5vh" }}> 
                <UserPieChart username={username} organisation={organisation} />
            </Box>
            {applications && applications?.length > 0 && !isLoading ? (<LeaveTableDetails applications={applications} />
            ) : (<NoDataFound message={"You dont have any leave applicatios"} />)}
        </>
    )
}
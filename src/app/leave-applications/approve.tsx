"use client"
import { getAllNewApplication, getApplicationByUsername } from "@/data/leaveapplications";
import { QueryResultRow } from "@vercel/postgres";
import { useState, useEffect } from "react";
import LeaveTable from "./tabledata";
import { NoDataFound } from "../../../components/misc/NoDataFound";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { ErrorOccured } from "../../../components/misc/ErrorOccured";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/data/user";
import { Box, Typography } from "@mui/material";
import { useUserContext } from "@/context/userContext";

export default function Approve() {
    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    const {organisationid} = useUserContext()
    const getApplications = () => getAllNewApplication(organisationid);
    const { data, isError, isLoading, error } = useQuery(['new-leave-applications', organisationid], getApplications,);
    useEffect(() => {
        if (!isLoading && data) {
            setApplications(data);
        }
    }, [data, isLoading])
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
            {applications && applications?.length > 0 && !isLoading ? (<LeaveTable applications={applications} />
            ) : (<NoDataFound message={"You dont have any leave applicatios"} />)}
        </>
    )
}
"use client"
import { useEffect, useState } from "react"
import LeaveTable, { LeaveTableDetails, LeaveTableReport, LeaveTableReportGrouped } from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername, getFilteredApplicationsForAdmin } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { NoDataFound } from "../../../components/misc/NoDataFound";
import { ErrorOccured } from "../../../components/misc/ErrorOccured";
import { Box, Button, Typography } from "@mui/material";
import Search from "./search";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminPieChart } from "./adminPieChart";
import { useUserContext } from "@/context/userContext";


export default function LeaveReports() {
    const { organisationid } = useUserContext();
    const searchParams = useSearchParams();
    const user = searchParams.get("user") || "";
    const leavetype = searchParams.get("leavetype") || "";
    const groupBy = searchParams.get('groupBy') || ''
    const [openSearch, setOpenSearch] = useState(false)
    const [applications, setApplications] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, isLoading, isError, error } = useQuery(["leave-admin-report", organisationid, user, leavetype, groupBy], () => getFilteredApplicationsForAdmin(user, leavetype, organisationid, groupBy))
    useEffect(() => {
        if (!isLoading) {
            setApplications(data)
        }
    }, [searchParams, leavetype, user, data, isLoading, groupBy, error, isError])

    if (isLoading) {
        return (
            <CircularProgressSpinner message="Loading data..." />
        )
    }
    if (isError) {
        return (
            <ErrorOccured message={(error as Error).message} />
        )
    }
    return (
        <>
            <Box>
                {openSearch && <Search placeholder="" />}
                <Button
                    onClick={() => setOpenSearch((prev) => !prev)}
                    size="small"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2, marginTop: 1 }}
                >
                    {openSearch ? "Close Search Bar" : "Open Search Bar"}
                </Button>
            </Box>
            {!groupBy && applications && <LeaveTableReport applications={applications} />}
            {groupBy && applications && <LeaveTableReportGrouped groupBy={groupBy} applications={applications} />}


        </>
    )
}
"use client"
import { useEffect, useState } from "react"
import LeaveTable, { LeaveTableDetails, LeaveTableReport, LeaveTableReportGrouped, LeaveTableReportGroupedByLeaveType } from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername, getFilteredApplicationsForAdmin } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { NoDataFound } from "../../../components/misc/NoDataFound";
import { ErrorOccured } from "../../../components/misc/ErrorOccured";
import { Box, Typography } from "@mui/material";
import Search from "./search";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminPieChart } from "./adminPieChart";


export default function LeaveReports({ organisation }: { organisation: string | undefined | null }) {
    const searchParams = useSearchParams();
    const user = searchParams.get("user") || "";
    const leavetype = searchParams.get("leavetype") || "";
    const [applications, setApplications] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, isLoading } = useQuery(["leave-admin-report", organisation, user, leavetype], () => getFilteredApplicationsForAdmin(user, leavetype, organisation))
    useEffect(() => {
        if (!isLoading) {
            setApplications(data)
        }
    }, [searchParams, leavetype, user, data, isLoading])

    return (
        <>
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >Leave Applications Report</Typography>
            </Box>
            <Box>
                <Search placeholder="" />
            </Box>
            <Box sx={{ paddingTop: "3vh", width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "5vh" }}>
                <AdminPieChart organisation={organisation} />
            </Box>
            {applications && <LeaveTableReport applications={applications} />}

        </>
    )
}
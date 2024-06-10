"use client"
import { useEffect, useState } from "react"
import LeaveTable, { LeaveTableDetails, LeaveTableReport, LeaveTableReportGrouped } from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { NoDataFound } from "../../../components/NoDataFound";
import { ErrorOccured } from "../../../components/ErrorOccured";
import { Box, Typography } from "@mui/material";
import Search from "./search";
import { useRouter, useSearchParams } from "next/navigation";


export default function LeaveReports() {
    const searchParams = useSearchParams();
    const groupBy = searchParams.get('groupBy') || "None";
    const user = searchParams.get("user") || "";
    const leavetype = searchParams.get("leavetype") || "";
    useEffect(() => {
    }, [searchParams, leavetype, user, groupBy])

  

    return (
        <>
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >Leave Applications Report</Typography>
            </Box>
            <Box>
                <Search placeholder="" />
            </Box>
            {groupBy == "None" &&  <LeaveTableReport user={user} leavetype={leavetype} />}
            {groupBy == "user" && <LeaveTableReportGrouped  />}
            {groupBy == "leavetype" &&  <LeaveTableReportGrouped />}

        </>
    )
}
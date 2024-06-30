"use client"
import { getPerformanceByProjectName } from "@/data/perfomance"
import { Box, Typography } from "@mui/material"
import { QueryResultRow } from "@vercel/postgres"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/data/user";
import { useSearchParams } from "next/navigation";
import { PerformanceSummaryForUserPerProject } from "../../../../../../../../components/performancetracker/user/userSummaryTables"
import { PerformanceSummaryForAdminPerUser } from "../../../../../../../../components/performancetracker/admin/adminSummaryTables"
import { pageContainer } from "../../../../../../../../components/styyle"
import { PageHeader } from "../../../../../../../../components/nav/pageHeader"
import { useUserContext } from "@/context/userContext"


export default function Page({ params }: { params: { id: string } }) {
    const id = decodeURIComponent(params.id);
    const searchParams = useSearchParams();
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";
    const timePeriod = searchParams.get("timePeriod") || "";
    const {username,organisationid} = useUserContext();
  
    return (
        <Box sx={pageContainer}>
            <Box >
                <PageHeader message={id}/>
            </Box>
            <Box sx={{ marginTop: "3vh" }} >
                <PerformanceSummaryForAdminPerUser timePeriod={timePeriod} startDate={startDateFilter} endDate={endDateFilter}  organisation={organisationid} username={id} />
            </Box>
        </Box>
    )
}
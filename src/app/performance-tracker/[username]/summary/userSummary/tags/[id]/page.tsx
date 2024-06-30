"use client"
import { getPerformanceByProjectName } from "@/data/perfomance"
import { Box, Typography } from "@mui/material"
import { QueryResultRow } from "@vercel/postgres"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/data/user";
import { PerformanceSummaryForUserPerProject, PerformanceSummaryForUserPerProjectTag } from "../../../../../../../../components/performancetracker/user/userSummaryTables"
import { useSearchParams } from "next/navigation"
import { useUserContext } from "@/context/userContext"


export default function Page({ params }: { params: { id: string } }) {
    const id = decodeURIComponent(params.id);
    const searchParams = useSearchParams();
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";
    const timePeriod = searchParams.get("timePeriod") || "";
    const { username, organisationid } = useUserContext();

    return (
        <Box>
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >{id} </Typography>
            </Box>
            <Box>
                {<PerformanceSummaryForUserPerProjectTag timePeriod={timePeriod} startDate={startDateFilter} endDate={endDateFilter} username={username} organisation={organisationid} tag={id} />
                }
            </Box>
        </Box>
    )
}
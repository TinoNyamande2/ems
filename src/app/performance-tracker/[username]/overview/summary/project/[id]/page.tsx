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
import { PerformanceSummaryForAdminPerProject } from "../../../../../../../../components/performancetracker/admin/adminSummaryTables"
import { pageContainer } from "../../../../../../../../components/styyle"
import { PageHeader } from "../../../../../../../../components/nav/pageHeader"


export default function Page({ params }: { params: { id: string } }) {
    const id = decodeURIComponent(params.id);
    const { data: session } = useSession();
    const [user, setUser] = useState<QueryResultRow | undefined>(undefined);
    const useremail = session?.user?.email;
    const fetchUser = () => getUserByEmail(useremail);
    const searchParams = useSearchParams();
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";
    const timePeriod = searchParams.get("timePeriod") || "";

    const { data, isError, isLoading } = useQuery(
        [useremail],
        fetchUser,
        {
            enabled: !!useremail,
        }
    );
    useEffect(() => {
        if (!isLoading) {
            setUser(data);
        }
    }, [session, isLoading, data])
    return (
        <Box sx={pageContainer}>
            <Box>
                <PageHeader message={id}/>
            </Box>
            <Box sx={{margiTop:"3vh"}}>
                {user && <PerformanceSummaryForAdminPerProject timePeriod={timePeriod} startDate={startDateFilter} endDate={endDateFilter} organisation={user.organisationid} project={id} />
            }
            </Box>
        </Box>
    )
}
"use client";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { PerformanceSummaryForUserProjects } from "../../../components/performancetracker/user/userSummaryTables";
import { UserSearchGroupBy, UserSummarySearch } from "./userSummarySearch";
import { useSearchParams ,usePathname, useRouter} from "next/navigation";


export default function Reports({ organisation, username, name }: { organisation: string | null | undefined, username: string | null | undefined, name: string | null | undefined }) {
    const searchParams = useSearchParams();
    const groupBy = searchParams.get("groupBy") || "";
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";
    const timePeriod = searchParams.get("timePeriod") || "";
    const pathname = usePathname();
    const { replace } = useRouter();
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.delete('groupBy');
        params.delete('timePeriod');
        params.delete('startDate');
        params.delete('endDate');
        replace(`${pathname}?${params.toString()}`);
    }, [pathname,searchParams])
    return (
        <Box>
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >
                    Summary for {name}
                </Typography>
            </Box>
            <Box>
                <UserSummarySearch placeholder="" />
            </Box>
            {<PerformanceSummaryForUserProjects startDate={startDateFilter} timePeriod={timePeriod} endDate={endDateFilter} username={username} groupBy={groupBy} organisation={organisation} />}
        </Box>
    );
}

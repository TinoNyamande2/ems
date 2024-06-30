"use client";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { PerformanceSummaryForUserProjects } from "../../../../../components/performancetracker/user/userSummaryTables";
import { UserSummarySearch } from "../../userSummarySearch";


export default function Reports() {
    const searchParams = useSearchParams();
    const groupBy = searchParams.get("groupBy") || "";
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";
    const timePeriod = searchParams.get("timePeriod") || "";
    const pathname = usePathname();
    const { organisationid, username, name } = useUserContext()
    const [openSearch, setOpenSearch] = useState(false)
    const { replace } = useRouter();
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        // params.delete('groupBy');
        // params.delete('timePeriod');
        // params.delete('startDate');
        // params.delete('endDate');
        replace(`${pathname}?${params.toString()}`);
    }, [pathname, searchParams, replace])
    return (
        <Box>
            <Box>
                {openSearch && <UserSummarySearch placeholder="" />}
                <Button
                    onClick={() => setOpenSearch((prev) => !prev)}
                    size="small"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2, marginTop: 1 }}
                >
                    {openSearch ? "Close Search Bar" : "Open Search Bar"}
                </Button>            </Box>
            {<PerformanceSummaryForUserProjects name={name} startDate={startDateFilter} timePeriod={timePeriod} endDate={endDateFilter} username={username} groupBy={groupBy} organisation={organisationid} />}
        </Box>
    );
}

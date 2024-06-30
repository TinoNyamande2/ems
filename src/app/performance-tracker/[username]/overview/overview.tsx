"use client"
import { getAllPerformanceFromPeriod } from "@/data/perfomance";
import { Autocomplete, Box, Button, Divider, TextField, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { validateHeaderValue } from "http";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns"
import { PerformanceSummaryForAdminProjects } from "../../../../../components/performancetracker/admin/adminSummaryTables";
import { AdminSummarySearch } from "../../adminSummarySearch";
import { useUserContext } from "@/context/userContext";

export default function Overview() {

    const [enddate, setEnddate] = useState(new Date());
    const defaultStartdate = subWeeks(enddate, 4);
    const [startdate, setStartDate] = useState(defaultStartdate);
    const router = useRouter();
    const searchParams = useSearchParams();
    const groupBy = searchParams.get("groupBy") || "";
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";
    const [openSearch, setOpenSearch] = useState(false)
    const timePeriod = searchParams.get("timePeriod") || "";
    const { organisationid } = useUserContext();
    useEffect(() => {
    }, [searchParams, startDateFilter, endDateFilter, timePeriod, groupBy])
    return (
        <Box>

            <Box>
                {openSearch && <AdminSummarySearch placeholder="" />}
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
            <hr />
            <Box sx={{ marginTop: "5vh", marginBotton: "5vh", marginLeft: "auto", marginRight: "auto", width: "80%" }} >
                <PerformanceSummaryForAdminProjects organisation={organisationid} timePeriod={timePeriod} startDate={startDateFilter} endDate={endDateFilter} groupBy={groupBy} />
            </Box>
        </Box>
    );
};

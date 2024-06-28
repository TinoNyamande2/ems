import { getAllPerformanceFromPeriod } from "@/data/perfomance";
import { Autocomplete, Box, Divider, TextField, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { ChangeEvent, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PerformancePieChart } from "./performancePieChart";
import { PerformanceByHourtable } from "./OverviewTable";
import { validateHeaderValue } from "http";
import Search from "./search";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns"
import { UserSummarySearch } from "./userSummarySearch";
import { PerformanceSummaryForAdminProjects } from "../../../components/performancetracker/admin/adminSummaryTables";
import { AdminSummarySearch } from "./adminSummarySearch";

export default function Overview({ organisation }: { organisation: string | null | undefined }) {

    const [enddate, setEnddate] = useState(new Date());
    const defaultStartdate = subWeeks(enddate, 4);
    const [startdate, setStartDate] = useState(defaultStartdate);
    const router = useRouter();
    const searchParams = useSearchParams();
    const groupBy = searchParams.get("groupBy") || "";
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";
    const timePeriod = searchParams.get("timePeriod") || "";
    useEffect(() => {
    }, [searchParams, startDateFilter, endDateFilter, timePeriod, groupBy])
    return (
        <Box>

            <Box sx={{ marginTop: "5vh", marginBotton: "5vh" }} >
                <AdminSummarySearch placeholder="" />
            </Box>
            <hr />
            <Box sx={{ marginTop: "5vh", marginBotton: "5vh", marginLeft: "auto", marginRight: "auto", width: "80%" }} >
                <PerformanceSummaryForAdminProjects organisation={organisation} timePeriod={timePeriod} startDate={startDateFilter} endDate={endDateFilter} groupBy={groupBy} />
            </Box>
        </Box>
    );
};

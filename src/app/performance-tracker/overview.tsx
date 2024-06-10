import { getAllPerformanceFromPeriod } from "@/data/perfomance";
import { Box, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PerformancePieChart } from "./performancePieChart";
import { PerformanceByHourtable } from "./OverviewTable";

export const Overview = () => {
    const [enddate, setEnddate] = useState(new Date());
    const defaultStartdate = subWeeks(enddate, 4);
    const [startdate, setStartDate] = useState(defaultStartdate);

    return (
        <Box>
            <PerformancePieChart startdate={startdate.toISOString()} enddate={enddate.toISOString()} />
            <PerformanceByHourtable startdate={startdate.toISOString()} enddate={enddate.toISOString()} />
        </Box>
    );
};

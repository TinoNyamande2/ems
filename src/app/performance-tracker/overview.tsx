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
import { useRouter ,useSearchParams} from "next/navigation";

export default function Overview (){
    
    const [enddate, setEnddate] = useState(new Date());
    const defaultStartdate = subWeeks(enddate, 4);
    const [startdate, setStartDate] = useState(defaultStartdate);
    const router = useRouter();
    const searchParams = useSearchParams();
    const groupBy = searchParams.get('groupBy')||"Project";
    const to = searchParams.get("to")||enddate.toISOString();
    const from = searchParams.get("from")||startdate.toISOString();
    useEffect(()=>{
    },[searchParams,to,from,groupBy])
    return (
        <Box>

            <Box sx={{ marginTop: "5vh", marginBotton: "5vh" }} >
                <Search placeholder="" />
            </Box>
            <hr />
            <Box sx={{ marginTop: "5vh", marginBotton: "5vh",marginLeft:"auto",marginRight:"auto",width:"80%" }} >
                <PerformancePieChart startdate={from} enddate={to} groupBy={groupBy}/>
            </Box>
            <Box sx={{ marginTop: "5vh", marginBotton: "5vh" }} >
                <PerformanceByHourtable startdate={from} enddate={to} groupBy={groupBy} />
            </Box>
        </Box>
    );
};

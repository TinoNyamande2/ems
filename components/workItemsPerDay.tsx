import { getPerformanceForDayByUsername } from "@/data/perfomance";
import { PerfomanceEdit } from "@/interfaces/performance";
import { Typography, Box } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export const WorkItemsPerDay = ({ date }: { date: string }) => {
    const { data: session } = useSession();
    const [workItems, setWorkItems] = useState<QueryResultRow[] | undefined>(undefined);
    const username = session?.user?.name
    const { data, isError,isLoading } = useQuery([username, date], () => getPerformanceForDayByUsername(username, date));
    useEffect(()=>{
        if(!isLoading) {
            console.log(data)
            setWorkItems(data);
        }
    },[session,date])

    return (
        <Box>
            {data?.map((item)=>{
                return (
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography>{item.project}</Typography>
                    <Typography>{item.summary}</Typography>
                    <Typography>{item.startTime.format('HH:mm')}-{item.endTime.format("HH:mm")}</Typography>
                </Box>
                )
            })}
        </Box>

    )
}  
import { getPerformanceForDayByUsername } from "@/data/perfomance";
import { Typography, Box } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { format } from 'date-fns';

export const WorkItemsPerDay = ({ date }: { date: string }) => {
  const { data: session } = useSession();
  const [workItems, setWorkItems] = useState<QueryResultRow[] | undefined>(undefined);

  const username = session?.user?.name;

  

  const fetchPerformance = () => getPerformanceForDayByUsername(username, date);

  const { data, isError, isLoading } = useQuery(
    [username, date],
    fetchPerformance,
    {
      enabled: !!username && !!date,
    }
  );

  useEffect(() => {
    if (!isLoading && data) {
      console.log(data);
      setWorkItems(data);
    }
  }, [isLoading, data]);

  return (
    <Box>
      {workItems?.map((item) => (
        <Box key={item.id} sx={{ display: "flex", flexDirection: "row" }}>
          <Typography sx={{fontWeight:"bold",flex:"1"}} >{item.project}</Typography>
          <Typography sx={{fontWeight:"bold",flex:"1"}} >{item.summary}</Typography>
          <Typography sx={{fontWeight:"bold",flex:"1"}} >{format(item.starttime,"HH:mm")} - {format(item.endtime,"HH:mm")}</Typography>
          <Typography sx={{fontWeight:"bold",flex:"1"}} >{parseFloat(item.totalhours).toFixed(2)} hours</Typography>
        </Box>
      ))}
    </Box>
  );
};

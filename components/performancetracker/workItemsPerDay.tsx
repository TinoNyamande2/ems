import { getPerformanceForDayByUsername } from "@/data/perfomance";
import { Typography, Box, TableContainer, Paper, Table, TableCell, TableHead, TableRow, Button } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { format } from 'date-fns';
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./../../src/app/globals.css"

export const WorkItemsPerDay = ({ username, date, refetchTrigger, organisation }: { username: string | null | undefined, date: string, refetchTrigger: number, organisation: string | null | undefined }) => {
  const [workItems, setWorkItems] = useState<QueryResultRow[] | undefined>(undefined);
  const [totalVal, setTotalVal] = useState(0)

  const router = useRouter();

  const handleRedirect = (url: string) => {
    router.push(url);
  };

  const fetchPerformance = () => getPerformanceForDayByUsername(username, date, organisation);

  const { data, isError, isLoading, refetch } = useQuery(
    [username, date],
    fetchPerformance,
    {
      enabled: !!username && !!date,
    }
  );

  useEffect(() => {
    if (!isLoading && data) {
      setWorkItems(data);
      const total = data.reduce((acc, row) => acc + parseFloat(row.totalhours), 0);
      setTotalVal(total)
    }
  }, [isLoading, data, refetchTrigger,date,organisation,username,totalVal]);

  useEffect(() => {
    if (refetchTrigger > 0) {
      refetch();
    }
  }, [refetchTrigger,refetch]);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {workItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontSize: "0.9em" }} >{item.projectname} </TableCell>
                <TableCell sx={{ fontSize: "0.9em" }} >{item.tagname} </TableCell>
                <TableCell className="truncate table-cell" ><p className="line-clamp-1 ">{item.summary} </p></TableCell>
                <TableCell sx={{  fontSize: "0.9em" }} >{format(item.starttime, "HH:mm a")} - {format(item.endtime, "HH:mm a")}</TableCell>
                <TableCell sx={{ fontSize: "0.9em" }} >{parseFloat(item.totalhours).toFixed(2)} hours</TableCell>
                <TableCell sx={{  fontSize: "0.9em" }} ><Button onClick={() => handleRedirect(`/performance-tracker/${item.id}`)}>View</Button> </TableCell>
              </TableRow>
            ))}
            {workItems && workItems.length > 0 &&
              <TableRow>
                <TableCell sx={{fontWeight:"bold",fontSize:"1.2em"}} >Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell sx={{fontWeight:"bold",fontSize:"1.2em"}}>{totalVal} hours</TableCell>
              </TableRow>}
          </TableHead>
        </Table>
      </TableContainer>
    </Box>
  );
};

import { getAllPerformanceFromPeriod, getHoursPerProject, getHoursPerProjectTable } from "@/data/perfomance";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
export const PerformanceByHourtable = ({startdate,enddate}:{startdate:string,enddate:string}) =>{
    const [performances, setPerformances] = useState<QueryResultRow[] | undefined>(undefined);
    const [totalHours,setTotalHours] = useState(1);
 

    const { data, isError, isLoading, error } = useQuery(
        ['performances', startdate, enddate],
        () => getHoursPerProject(startdate, enddate)
    );

    useEffect(() => {
        if (!isLoading && data) {
            setPerformances(data);
            const total = data.reduce((acc, row) => acc + parseFloat(row.value), 0);
            console.log(data)
            setTotalHours(total)
            console.log(total)
       
        }
    }, [data, isLoading]);
    return (
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Total Hours</TableCell>
                    <TableCell>Percentage</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {performances?.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell>{row.value}</TableCell>
                        <TableCell>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}
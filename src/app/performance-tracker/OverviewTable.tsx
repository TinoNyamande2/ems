import { getAllPerformanceFromPeriod, getHoursPerProject, getHoursPerProjectTable } from "@/data/perfomance";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { useQuery } from "react-query";
export const PerformanceByHourtable = ({startdate,enddate,groupBy}:{startdate:string,enddate:string,groupBy:string}) =>{
    const [performances, setPerformances] = useState<QueryResultRow[] | undefined>(undefined);
    const [totalHours,setTotalHours] = useState(1);
 

    const { data, isError, isLoading, error } = useQuery(
        ['table-performances', startdate, enddate],
        () => getHoursPerProject(startdate, enddate,groupBy)
    );

    useEffect(() => {
        if (!isLoading && data) {
            setPerformances(data);
            console.log("Table",data)
            const total = data.reduce((acc, row) => acc + parseFloat(row.value), 0);
            setTotalHours(total)
       
        }
    }, [data, isLoading]);
    if (isLoading) {
        return <CircularProgressSpinner message="Loading Applications" />
    }
    if(isError) {
        return (
            <p>Error occured</p>
        )
    }
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
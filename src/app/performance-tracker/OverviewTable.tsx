import { getAllPerformanceFromPeriod, getHoursPerProject, getHoursPerProjectTable } from "@/data/perfomance";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { useQuery } from "react-query";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export const PerformanceByHourtable = ({ startdate, enddate, groupBy }: { startdate: string, enddate: string, groupBy: string }) => {
    const [performances, setPerformances] = useState<QueryResultRow[] | undefined>(undefined);
    const [totalHours, setTotalHours] = useState(1);


    const { data, isError, isLoading, error } = useQuery(
        ['table-performances', startdate, enddate],
        () => getHoursPerProject(startdate, enddate, groupBy)
    );
    const router = useRouter();

    const handleRedirect = (url: string) => {
        console.log(url)
        if (groupBy === 'User') {
            router.push(`/performance-tracker/user/${url}`);
        } else {
            router.push(`/performance-tracker/project/${url}`);
        }
    };

    useEffect(() => {
        if (!isLoading && data) {
            setPerformances(data);
            console.log("Table", data)
            const total = data.reduce((acc, row) => acc + parseFloat(row.value), 0);
            setTotalHours(total)

        }
    }, [data, isLoading]);
    if (isLoading) {
        return <CircularProgressSpinner message="Loading Applications" />
    }
    if (isError) {
        return (
            <p>Error occured</p>
        )
    }


    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Project</TableCell>
                        <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Total Hours</TableCell>
                        <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Percentage</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {performances?.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell><Button onClick={() => handleRedirect(row.label)}>{row.label}</Button></TableCell>
                            <TableCell>{row.value}</TableCell>
                            <TableCell>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                    ))}
                    <TableRow sx={{fontWeight:"bold"}}>
                        <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Total</TableCell>
                        <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >{totalHours}</TableCell>
                        <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}}  >100%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}
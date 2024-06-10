import { getAllPerformanceFromPeriod, getHoursPerProject, getHoursPerProjectTable, getPerformanceByProjectName, getPerformanceByUserName, getPerformanceForProjectGroupByUserName } from "@/data/perfomance";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../../../components/CircularProgress";
import { useQuery } from "react-query";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { CustomPieChart } from "../../../../../components/PieChart";

interface ProjectGraph {
    id: string,
    label: string,
    value: number
}

export const ProjectsTable = ({ id }: { id: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([id,"user project data"], () => getPerformanceByUserName(id));
    const [performanceData, setPerformanceData] = useState<ProjectGraph[]>([])
    const [returnedData, setReturnedData] = useState<QueryResultRow[] | undefined>(undefined)

    useEffect(() => {
        if (!isLoading && data) {
            setProjectData(data);
            console.log(data)
            const total = data.reduce((acc, row) => acc + parseFloat(row.value), 0);
            setTotalHours(total)
            setReturnedData(data)
            if (returnedData) {

                const transformedData: ProjectGraph[] = returnedData?.map(item => ({
                    id: item.id,
                    label: item.label,
                    value: item.value
                }));
                setPerformanceData(transformedData);
            }

        }
    }, [isLoading, data, returnedData])


    const [totalHours, setTotalHours] = useState(1);



    if (isLoading) {
        return <CircularProgressSpinner message="Loading Applications" />
    }
    if (isError) {
        return (
            <p>Error occured</p>
        )
    }


    return (
        <>
            <Box>
                {performanceData.length > 0 ? <CustomPieChart data={performanceData} /> : <p>No data available</p>}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Users</TableCell>
                            <TableCell>Total Hours</TableCell>
                            <TableCell>Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.label}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>Total</TableCell>
                            <TableCell>{totalHours}</TableCell>
                            <TableCell>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    )
}



export const UsersTable = ({ id }: { id: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([id,"users data "], () => getPerformanceForProjectGroupByUserName(id));
    const [performanceData, setPerformanceData] = useState<ProjectGraph[]>([])
    const [returnedData, setReturnedData] = useState<QueryResultRow[] | undefined>(undefined)

    useEffect(() => {
        if (!isLoading && data) {
            setProjectData(data);
            const total = data.reduce((acc, row) => acc + parseFloat(row.value), 0);
            setTotalHours(total)
            setReturnedData(data)
            if (returnedData) {

                const transformedData: ProjectGraph[] = returnedData?.map(item => ({
                    id: item.id,
                    label: item.label,
                    value: item.value
                }));
                setPerformanceData(transformedData);
            }

        }
    }, [isLoading, data, returnedData])


    const [totalHours, setTotalHours] = useState(1);



    if (isLoading) {
        return <CircularProgressSpinner message="Loading Applications" />
    }
    if (isError) {
        return (
            <p>Error occured</p>
        )
    }


    return (
        <>

            <Typography>Users Table</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Total Hours</TableCell>
                            <TableCell>Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.label}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>Total</TableCell>
                            <TableCell>{totalHours}</TableCell>
                            <TableCell>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    )
}





import { getAllPerformanceFromPeriod, getHoursPerProject, getHoursPerProjectTable, getPerformanceByProjectName, getPerformanceForProjectGroupByUserName } from "@/data/perfomance";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { subWeeks } from "date-fns";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../../../components/misc/CircularProgress";
import { useQuery } from "react-query";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { CustomPieChart } from "../../../../../components/charts/PieChart";
import { useUserContext } from "@/context/userContext";

interface ProjectGraph {
    id: string,
    label: string,
    value: number
}

export const ProjectsTable = ({ id }: { id: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const {organisation} = useUserContext();
    const { data, error, isError, isLoading } = useQuery([id, "project data"], () => getPerformanceByProjectName(id,organisation));
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
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >Grouped By Project Tags</Typography>
            </Box>
            <Box>
                {performanceData.length > 0 ? <CustomPieChart data={performanceData} /> : <p>No data available</p>}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Tag</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Total Hours</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Percentage</TableCell>
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
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Total</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >{totalHours}</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    )
}



export const UsersTable = ({ id }: { id: string }) => {
    const {organisation} = useUserContext();
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([id, "users data "], () => getPerformanceForProjectGroupByUserName(id,organisation));
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

            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >Grouped By  Users</Typography>
            </Box>            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >User</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Total Hours</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Percentage</TableCell>
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
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >Total</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >{totalHours}</TableCell>
                            <TableCell sx={{fontWeight:"bold",fontSize:"1.3em"}} >100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    )
}


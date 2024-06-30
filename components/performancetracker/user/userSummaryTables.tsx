import { getFilteredPerformanceSummaryForUser, getPerformanceSummaryForUser, getPerformanceSummaryForUserPerProject, getPerformanceSummaryForUserPerProjecttag } from "@/data/perfomance";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { useQuery } from "react-query";
import { CustomPieChart } from "../../../components/charts/PieChart"
import { useRouter } from "next/navigation";
import { tableCell, tableContainer, tableHead } from "../../styyle";

interface ProjectGraph {
    id: string,
    label: string,
    value: number,
}

export const PerformanceSummaryForUserProjects = ({ name, groupBy, organisation, username, timePeriod, startDate, endDate }: { name: string, groupBy: string, organisation: string | null | undefined, username: string | null | undefined, timePeriod: string, startDate: string, endDate: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([timePeriod, startDate, endDate, groupBy, username, organisation, "user performance data"], () => getFilteredPerformanceSummaryForUser(username, organisation, groupBy, timePeriod, startDate, endDate));
    const [performanceData, setPerformanceData] = useState<ProjectGraph[]>([])
    const [returnedData, setReturnedData] = useState<QueryResultRow[] | undefined>(undefined)
    const router = useRouter();

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
    }, [isLoading, data, returnedData, groupBy])


    const [totalHours, setTotalHours] = useState(1);



    if (isLoading) {
        return <CircularProgressSpinner message="Loading Data" />
    }
    if (isError) {
        return (
            <p>Error occured</p>
        )
    }



    const handleRedirect = (id: string) => {
        let url


        if (groupBy.trim() == "Project Tags") {
            url = `/performance-tracker/${name}/summary/userSummary/tags/${id}?timePeriod=${encodeURIComponent(timePeriod)}&?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        } else {
            url = `/performance-tracker/${name}/summary/userSummary/projects/${id}?timePeriod=${encodeURIComponent(timePeriod)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }
        router.push(url);
    };



    return (
        <>
            <Box sx={{ maxWidth: "80%" }}>
                {performanceData.length > 0 && <CustomPieChart data={performanceData} />}
            </Box>
            <TableContainer component={Paper} sx={tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={tableHead}>
                                Total Hours
                            </TableCell>
                            <TableCell sx={tableHead}>
                                Percentage
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    sx={tableCell}
                                >
                                    <Button size="small" onClick={() => handleRedirect(`${row.label}`)}>
                                        {row.label}
                                    </Button>
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    {row.value.toFixed(2)}
                                </TableCell>
                                <TableCell sx={tableCell}>
                                    {((row.value / totalHours) * 100).toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={tableHead}>
                                Total
                            </TableCell>
                            <TableCell sx={tableHead}>
                                {totalHours.toFixed(2)}
                            </TableCell>
                            <TableCell sx={tableHead}>
                                100%
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const PerformanceSummaryForUserPerProject = ({ project, organisation, username, timePeriod, startDate, endDate }: { project: string, organisation: string | null | undefined, username: string | null | undefined, timePeriod: string, startDate: string, endDate: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([timePeriod, startDate, endDate, username, organisation, project, "user performance data per project"], () => getPerformanceSummaryForUserPerProject(username, organisation, project, timePeriod, startDate, endDate));
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
        return <CircularProgressSpinner message="Loading Data" />
    }
    if (isError) {
        return (
            <p>Error occured</p>
        )
    }


    return (
        <>
            <Box>
                {performanceData.length > 0 && <CustomPieChart data={performanceData} />}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={tableHead}>Total Hours</TableCell>
                            <TableCell sx={tableHead}>%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell sx={tableCell}>{row.label}</TableCell>
                                <TableCell sx={tableCell}>{row.value}</TableCell>
                                <TableCell sx={tableCell}>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={tableHead}>Total</TableCell>
                            <TableCell sx={tableCell}>{totalHours}</TableCell>
                            <TableCell sx={tableCell}>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const PerformanceSummaryForUserPerProjectTag = ({ tag, organisation, username, timePeriod, startDate, endDate }: { tag: string, organisation: string | null | undefined, username: string | null | undefined, timePeriod: string, startDate: string, endDate: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([startDate, endDate, timePeriod, username, organisation, tag, "user performance data per project tag"], () => getPerformanceSummaryForUserPerProjecttag(username, organisation, tag, timePeriod, startDate, endDate));
    const [performanceData, setPerformanceData] = useState<ProjectGraph[]>([])
    const [returnedData, setReturnedData] = useState<QueryResultRow[] | undefined>(undefined)

    useEffect(() => {
        if (!isLoading && data) {
            setProjectData(data);
            console.log("tags data", data)
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
        return <CircularProgressSpinner message="Loading Data" />
    }
    if (isError) {
        return (
            <p>Error occured</p>
        )
    }


    return (
        <>
            <Box>
                {performanceData.length > 0 && <CustomPieChart data={performanceData} />}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={tableHead}>Total Hours</TableCell>
                            <TableCell sx={tableHead} >Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell sx={tableCell} >{row.label}</TableCell>
                                <TableCell sx={tableCell} >{row.value}</TableCell>
                                <TableCell sx={tableCell} >{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={tableHead} >Total</TableCell>
                            <TableCell sx={tableHead} >{totalHours}</TableCell>
                            <TableCell sx={tableHead} >100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
import { getFilteredPerformanceSummaryForAdmin, getFilteredPerformanceSummaryForUser, getPerformanceSummaryForUser, getPerformanceSummaryForUserPerProject, getPerformanceSummaryForUserPerProjectForAdmin, getPerformanceSummaryForUserPerProjecttag, getPerformanceSummaryForUserPerProjecttagForAdmin, getPerformanceSummaryPerUserForAdmin } from "@/data/perfomance";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { useQuery } from "react-query";
import { CustomPieChart } from "../../../components/charts/PieChart"
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { tableCell, tableContainer, tableHead } from "../../styyle";
import { ErrorOccured } from "../../misc/ErrorOccured";
import { NoDataFound } from "../../misc/NoDataFound";

interface ProjectGraph {
    id: string,
    label: string,
    value: number,
}

export const PerformanceSummaryForAdminProjects = ({ groupBy, organisation, timePeriod, startDate, endDate }: { groupBy: string, organisation: string | null | undefined, timePeriod: string, startDate: string, endDate: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([timePeriod, startDate, endDate, groupBy, organisation, "admin performance data"], () => getFilteredPerformanceSummaryForAdmin(organisation, groupBy, timePeriod, startDate, endDate));
    const [performanceData, setPerformanceData] = useState<ProjectGraph[]>([])
    const [returnedData, setReturnedData] = useState<QueryResultRow[] | undefined>(undefined)
    const router = useRouter();
    const { name } = useUserContext();

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
            url = `/performance-tracker/${name}/overview/summary/projecttags/${id}?timePeriod=${encodeURIComponent(timePeriod)}&?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        } else if (groupBy == "Project") {
            url = `/performance-tracker/${name}/overview/summary/project/${id}?timePeriod=${encodeURIComponent(timePeriod)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        } else {
            url = `/performance-tracker/${name}/overview/summary/user/${id}?timePeriod=${encodeURIComponent(timePeriod)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }
        router.push(url);
    };



    return (
        <>
            <Box>
                {performanceData.length > 0 && <CustomPieChart data={performanceData} />}
            </Box>

            <TableContainer component={Paper} sx={tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={tableHead} >Total Hours</TableCell>
                            <TableCell sx={tableHead} >%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell size="small" sx={tableCell} ><Button sx={{ fontSize: "0.8em", textAlign: "left" }} onClick={() => handleRedirect(`${row.label}`)}>{row.label} </Button></TableCell>
                                <TableCell sx={tableCell}>{row.value.toFixed(2)}</TableCell>
                                <TableCell sx={tableCell}>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={tableHead} >Total</TableCell>
                            <TableCell sx={tableHead}>{totalHours.toFixed(2)}</TableCell>
                            <TableCell sx={tableHead}>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const PerformanceSummaryForAdminPerProject = ({ project, organisation, timePeriod, startDate, endDate }: { project: string, organisation: string | null | undefined, timePeriod: string, startDate: string, endDate: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([timePeriod, startDate, endDate, organisation, project, "admin performance data per project"], () => getPerformanceSummaryForUserPerProjectForAdmin(organisation, project, timePeriod, startDate, endDate));
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
            <ErrorOccured message={(error as Error).message} />
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
                            <TableCell sx={tableHead} >Total Hours</TableCell>
                            <TableCell sx={tableHead} >Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell sx={tableCell} >{row.label}</TableCell>
                                <TableCell sx={tableCell}>{row.value}</TableCell>
                                <TableCell sx={tableCell}>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
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

export const PerformanceSummaryForAdminPerUser = ({ username, organisation, timePeriod, startDate, endDate }: { username: string, organisation: string | null | undefined, timePeriod: string, startDate: string, endDate: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([startDate, endDate, timePeriod, organisation, username, "user performance data user"], () => getPerformanceSummaryPerUserForAdmin(organisation, username, timePeriod, startDate, endDate));
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
            <ErrorOccured message={(error as Error).message} />
        )
    }


    return (
        <>
            <Box>
                {performanceData.length > 0 && <CustomPieChart data={performanceData} />}
            </Box>
            {!isLoading && performanceData.length > 0 ? (<TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableHead} ></TableCell>
                            <TableCell sx={tableHead} >Total Hours</TableCell>
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
            </TableContainer>) : (<NoDataFound message="No data found" />)}
        </>
    )
}

export const PerformanceSummaryForAdminPerProjectTag = ({ tag, organisation, timePeriod, startDate, endDate }: { tag: string, organisation: string | null | undefined, timePeriod: string, startDate: string, endDate: string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([startDate, endDate, timePeriod, organisation, tag, "user performance data user per project tag"], () => getPerformanceSummaryForUserPerProjecttagForAdmin(organisation, tag, timePeriod, startDate, endDate));
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
            <ErrorOccured message={(error as Error).message} />
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
                            <TableCell sx={tableHead} >Total Hours</TableCell>
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
                            <TableCell sx={tableHead}  >100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
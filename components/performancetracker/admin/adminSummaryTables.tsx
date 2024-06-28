import { getFilteredPerformanceSummaryForAdmin, getFilteredPerformanceSummaryForUser, getPerformanceSummaryForUser, getPerformanceSummaryForUserPerProject, getPerformanceSummaryForUserPerProjectForAdmin, getPerformanceSummaryForUserPerProjecttag, getPerformanceSummaryForUserPerProjecttagForAdmin, getPerformanceSummaryPerUserForAdmin } from "@/data/perfomance";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { useQuery } from "react-query";
import { CustomPieChart } from "../../../components/charts/PieChart"
import { useRouter } from "next/navigation";

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
            url = `/performance-tracker/summary/projecttags/${id}?timePeriod=${encodeURIComponent(timePeriod)}&?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        } else if(groupBy=="User") {
            url = `/performance-tracker/summary/user/${id}?timePeriod=${encodeURIComponent(timePeriod)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }else  {
            url = `/performance-tracker/summary/project/${id}?timePeriod=${encodeURIComponent(timePeriod)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }
        router.push(url);
    };



    return (
        <>
            <Box>
                {performanceData.length > 0 && <CustomPieChart data={performanceData}  />}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }} >Total Hours</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectData?.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell><button onClick={() => handleRedirect(`${row.label}`)}>{row.label} </button></TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{((row.value / totalHours) * 100).toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Total</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>{totalHours}</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const PerformanceSummaryForAdminPerProject = ({ project, organisation,timePeriod,startDate,endDate}: { project: string, organisation: string | null | undefined,timePeriod:string,startDate:string,endDate:string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([timePeriod,startDate,endDate,organisation, project, "admin performance data per project"], () => getPerformanceSummaryForUserPerProjectForAdmin(organisation, project,timePeriod,startDate,endDate));
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
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Total Hours</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Percentage</TableCell>
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
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Total</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>{totalHours}</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const PerformanceSummaryForAdminPerUser = ({ username, organisation,timePeriod,startDate,endDate }: { username: string, organisation: string | null | undefined,timePeriod:string,startDate:string,endDate:string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([startDate,endDate,timePeriod,organisation, username, "user performance data user"], () => getPerformanceSummaryPerUserForAdmin(organisation, username,timePeriod,startDate,endDate));
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
                {performanceData.length > 0 && <CustomPieChart data={performanceData}  />}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Total Hours</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Percentage</TableCell>
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
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Total</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>{totalHours}</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export const PerformanceSummaryForAdminPerProjectTag = ({ tag, organisation,timePeriod,startDate,endDate }: { tag: string, organisation: string | null | undefined,timePeriod:string,startDate:string,endDate:string }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([startDate,endDate,timePeriod,organisation, tag, "user performance data user per project tag"], () => getPerformanceSummaryForUserPerProjecttagForAdmin(organisation, tag,timePeriod,startDate,endDate));
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
                {performanceData.length > 0 && <CustomPieChart data={performanceData}  />}
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Total Hours</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Percentage</TableCell>
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
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>Total</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>{totalHours}</TableCell>
                            <TableCell sx={{ fontSize: "1.3em", fontWeight: "bold" }}>100%</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
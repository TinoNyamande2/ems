import { getPerformanceSummaryForUser } from "@/data/perfomance";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useEffect, useState } from "react";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { useQuery } from "react-query";
import { CustomPieChart } from "../../../components/charts/PieChart"

interface ProjectGraph {
    id: string,
    label: string,
    value: number
}

export const PerformanceSummaryForUserTable = ({ organisation,username}: { organisation:string|null|undefined,username:string|null|undefined }) => {
    const [projectData, setProjectData] = useState<QueryResultRow[] | undefined>(undefined)
    const { data, error, isError, isLoading } = useQuery([username,organisation,"user performance data"], () => getPerformanceSummaryForUser(username,organisation));
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
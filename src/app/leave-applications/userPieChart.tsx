"use client"
import { getApplicationsByLeaveTypeForUser } from "@/data/leaveapplications"
import { QueryResultRow } from "@vercel/postgres";
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { CustomPieChart } from "../../../components/charts/PieChart";
interface PieData {
    id: string,
    label: string,
    value: number
}
export const UserPieChart = ({ username, organisation }: { username: string | null | undefined, organisation: string | null | undefined }) => {
    const [applicationData, setApplicationData] = useState<QueryResultRow[] | undefined>(undefined);
    const [showData, setShowData] = useState<PieData[]>([]);
    const { isLoading, data, error, isError } = useQuery(["user-pie-chart-data", username, organisation], () => getApplicationsByLeaveTypeForUser(username, organisation))
    useEffect(() => {
        if (!isLoading && data) {
            console.log("Pie data", data)
            setApplicationData(data)
            if (applicationData) {

                const transformedData: PieData[] = applicationData?.map(item => ({
                    id: item.id,
                    label: item.label,
                    value: item.value
                }));
                setShowData(transformedData);
            }

        }
    }, [isLoading, data, applicationData])

    return (
        <>
            {showData.length > 0 ? <CustomPieChart data={showData} /> : <p></p>}
        </>
    )
}
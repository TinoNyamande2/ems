"use client"
import { getHoursPerProject } from "@/data/perfomance"
import { QueryResultRow } from "@vercel/postgres";
import { useEffect,useState } from "react";
import { useQuery } from "react-query"
import { CustomPieChart } from "../../../components/PieChart";
import { CircularProgressSpinner, SmallCircularProgressSpinner } from "../../../components/CircularProgress";

interface ProjectGraph {
    id:string,
    label:string,
    value:number
}

export const PerformancePieChart = ({ startdate, enddate,groupBy }: { startdate: string, enddate: string;groupBy:string }) => {
    const [performanceData, setPerformanceData] = useState<ProjectGraph[]>([])
    const [returnedData , setReturnedData] = useState<QueryResultRow[]|undefined>(undefined)
    const { data, isLoading, error } = useQuery(["pie-data", startdate, enddate], () => getHoursPerProject(startdate, enddate,groupBy));

    useEffect(() => {
        if (!isLoading && data) {
            console.log("Pie",data)
            setReturnedData(data)
            if(returnedData) {

                const transformedData: ProjectGraph[] = returnedData?.map(item => ({
                    id: item.id,
                    label: item.label,
                    value: item.value 
                  }));
                  setPerformanceData(transformedData);
            }
            
        }
    },[isLoading,data,returnedData])
    if (isLoading) {
        return <SmallCircularProgressSpinner message="Loading Data" />
    }
    return (
        <>
      {performanceData.length > 0 ? <CustomPieChart data={performanceData} /> : <p>No data available</p>}
      </>
        
    )
}
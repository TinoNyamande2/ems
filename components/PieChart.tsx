"use client"
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface ProjectGraph {
    id:string,
    label:string,
    value:number
}
export const CustomPieChart = ({data}:{data:ProjectGraph[]}) =>{
    
  return (
    <PieChart
      series={[
        {
          data: data,
        },
      ]}
      width={400}
      height={200}
    />
  );
}

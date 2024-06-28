"use client"
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

interface ProjectGraph {
    id:string,
    label:string,
    value:number
}
export const CustomPieChart = ({data}:{data:ProjectGraph[]}) =>{
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  const dataWithPercentages = data.map(item => ({
    ...item,
    label: `${item.label} (${((item.value / totalValue) * 100).toFixed(2)}%)`
  }));
  return (
    <Box>
      <PieChart
      series={[
        {
          data: dataWithPercentages,
        },
      ]}
      width={800}
      height={300}
    />
    </Box>
  );
}

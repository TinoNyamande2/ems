'use client';
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

interface ProjectGraph {
    id: string,
    label: string,
    value: number
}

export const CustomPieChart = ({ data }: { data: ProjectGraph[] }) => {
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dataWithPercentages = data.map(item => ({
    ...item,
    label:isSmallScreen? `${item.label}`:`${item.label} (${((item.value / totalValue) * 100).toFixed(2)}%)` 
  }));

 

  return (
    <Box
      sx={{
        width: '50%',
        maxWidth: isSmallScreen ? '40%' : '700px',
        margin: '0',
      }}
    >
      <PieChart
        series={[
          {
            data: dataWithPercentages,
          },
        ]}
        width={isSmallScreen ? 300 : 800}
        height={300}
      />
    </Box>
  );
}

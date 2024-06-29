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

  const dataWithPercentages = data.map(item => ({
    ...item,
    label: `${item.label} (${((item.value / totalValue) * 100).toFixed(2)}%)`
  }));

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isSmallScreen ? '100%' : '800px',
        margin: '0 auto',
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

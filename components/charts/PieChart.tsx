'use client';
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

interface ProjectGraph {
  id: string;
  label: string;
  value: number;
}

export const CustomPieChart = ({ data }: { data: ProjectGraph[] }) => {
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("md"))
  const dataWithPercentages = data.map(item => ({
    ...item,
    label: isSmallScreen ? `${item.label}` : `${item.label} (${((item.value / totalValue) * 100).toFixed(2)}%)`
  }));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isSmallScreen ? '100%' : '700px',
        margin: '0 auto',
      }}
    >
      <PieChart
        series={[
          {
            data: dataWithPercentages,
          },
        ]}
        width={isSmallScreen ? 250 :isLargeScreen ? 400: 800}
        height={300}
        sx={{
          '& .MuiPieChart-label': {
            display: isSmallScreen ? 'none' : 'block',
          },
        }}
      />
    </Box>
  );
};

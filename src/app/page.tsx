"use client"
import Image from "next/image";
import { Box, Grid, Paper, Typography } from "@mui/material"
import { useEffect } from "react";
import Dashboard from "./defaultcomponents/Dashboard"
import { ProductsContainer } from "../../components/products/productsContainer";
import Chart from "./defaultcomponents/Chart";
import Deposits from "./defaultcomponents/Deposits";
import Orders from "./defaultcomponents/Orders";
import { getServerSession } from 'next-auth';
import {redirect} from 'next/navigation'
import { authOptions } from "../../lib/authOptions";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"


export default  function Home() {

 const { data: session } = useSession();
  
  // if(!session) {
  //   redirect("/login")
  // }

  return (
    <Grid container spacing={3}>
      <h2>{session?.user?.name}</h2>
    {/* Chart */}
    <Grid item xs={12} md={8} lg={9}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
        <Chart />
      </Paper>
    </Grid>
    {/* Recent Deposits */}
    <Grid item xs={12} md={4} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 240,
        }}
      >
        <Deposits />
      </Paper>
    </Grid>
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Orders />
      </Paper>
    </Grid>
  </Grid>
  );
}

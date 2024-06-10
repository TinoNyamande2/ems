"use client"

import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Apply from "./apply";
import Applications from "./applications";
import Approve from "./approve";
import Overview from "./overview";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import {redirect} from 'next/navigation'
import { getUserByEmail } from "@/data/user";
import { useQuery } from "react-query";
import { QueryResultRow } from "@vercel/postgres";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { alpha } from '@mui/material';
import PendingApplications from "./pending";
import LeaveReports from "./reports";




export default function Page () {
    const [applySelected, setApplySelected] = useState(false);
    const [applicationsSelected, setApplicationsSelected] = useState(true);
    const [approveSelected, setApproveSelected] = useState(false);
    const [pendingSelected, setPendingSelected] = useState(false);
    const [reportsSelected, setReportsSelected] = useState(false);
    const [user,setUser] = useState<QueryResultRow|undefined>(undefined);
    const handleApplySelected = () => {
        setApplySelected(true);
        setApplicationsSelected(false);
        setApproveSelected(false);
        setPendingSelected(false);
        setReportsSelected(false)
    }
    const handleApplicationsSelected = () => {
        setApplySelected(false);
        setApplicationsSelected(true);
        setApproveSelected(false);
        setPendingSelected(false);
        setReportsSelected(false)

    }
    const handleApproveSelected = () => {
        setApplySelected(false);
        setApplicationsSelected(false);
        setApproveSelected(true);
        setPendingSelected(false);
        setReportsSelected(false)

    }
    const handlePendingSelected = () => {
        setApplySelected(false);
        setApplicationsSelected(false);
        setApproveSelected(false);
        setPendingSelected(true);
        setReportsSelected(false)

    }
    const handleReportsSelected = () => {
      setApplySelected(false);
      setApplicationsSelected(false);
      setApproveSelected(false);
      setPendingSelected(false);
      setReportsSelected(true)

  }
    const { data: session } = useSession();
    const useremail = session?.user?.email;
  
    if(!session) {
      redirect("/login")
    }
    const fetchUser = () => getUserByEmail(useremail);

    const { data, isError, isLoading } = useQuery(
      [useremail],
      fetchUser,
      {
        enabled: !!useremail,
      }
    );
    useEffect(()=>{
        if(!isLoading) {
            setUser(data);
        }
    },[session,isLoading,data])
  if(isLoading) {
    return <CircularProgressSpinner message="Loading"/>
  }

    return (
        <Box
        id="image"
        sx={(theme) => ({
          mt: { xs: 8, sm: 2 },
          alignSelf: 'center',
          height: { xs: 200, sm: 700 },
          width: '100%',
          backgroundImage:
            theme.palette.mode === 'light'
              ? 'url("/static/images/templates/templates-images/hero-light.png")'
              : 'url("/static/images/templates/templates-images/hero-dark.png")',
          backgroundSize: 'cover',
          borderRadius: '10px',
          outline: '1px solid',
          outlineColor:
            theme.palette.mode === 'light'
              ? alpha('#BFCCD9', 0.5)
              : alpha('#9CCCFC', 0.1),
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
              : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
        })}
        >
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Button size="small" onClick={handleApplicationsSelected} fullWidth sx={{
                    ...(applicationsSelected && { backgroundColor: "blue", color: "white" }),
                }} >Leave Applications</Button>
                <Button size="small" onClick={handleApplySelected} fullWidth sx={{
                    ...(applySelected && { backgroundColor: "blue", color: "white" }),
                }}>Apply</Button>
                {user?.role=='admin' && !isLoading && <Button size="small" onClick={handleApproveSelected} fullWidth sx={{
                    ...(approveSelected && { backgroundColor: "blue", color: "white" }),
                }}>Approve Applications</Button>}
                {user?.role=='ad' && !isLoading && <Button size="small" onClick={handleReportsSelected} fullWidth sx={{
                    ...(reportsSelected && { backgroundColor: "blue", color: "white" }),
                }}>Reports</Button>}
                {user?.role !='admin' && !isLoading && <Button size="small" onClick={handleApproveSelected} fullWidth sx={{
                    ...(pendingSelected && { backgroundColor: "blue", color: "white" }),
                }}>Pending Applications</Button>}
            
            </Box>
            <Box sx={{marginTop:"3vh"}}>
                {applicationsSelected && <Applications/>}
                {applySelected && <Apply/>}
                {approveSelected && <Approve />}
                {pendingSelected && <PendingApplications />}
                {reportsSelected && <LeaveReports />}

            </Box>
        </Box>
    )

}
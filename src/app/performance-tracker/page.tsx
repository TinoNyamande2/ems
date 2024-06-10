"use client"

import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import WorkItems from "./create";
import Reports from "./reports";
import  Overview  from "./overview";
import { getUserByEmail } from "@/data/user";
import { QueryResultRow } from "@vercel/postgres";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { alpha } from '@mui/material';


export default function Page () {
    const [trackerSelected, setTrackerSelected] = useState(true);
    const [reportsSelected, setReportsSelected] = useState(false);
    const [overviewSelected,setOverviewSelected] = useState(false);
    const [user,setUser] = useState<QueryResultRow|undefined>(undefined);

    const handleTrackerSelected = () => {
        setTrackerSelected(true);
        setReportsSelected(false);
        setOverviewSelected(false)
    }
    const handleReportsSelected = () => {
        setTrackerSelected(false);
        setReportsSelected(true);
        setOverviewSelected(false)
    }

    const handleOverviewSelected = () => {
        setTrackerSelected(false);
        setReportsSelected(false);
        setOverviewSelected(true)
    }
    const { data: session } = useSession();
    const useremail = session?.user?.email;
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
            <Box sx={{marginTop:"4vh" ,display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Button size="small" onClick={handleTrackerSelected} fullWidth sx={{
                    ...(trackerSelected && { backgroundColor: "blue", color: "white" }),
                }} >Tracker</Button>
                <Button size="small" onClick={handleReportsSelected} fullWidth sx={{
                    ...(reportsSelected && { backgroundColor: "blue", color: "white" }),
                }}>Summary</Button>
                               {user?.role =='admin' && !isLoading &&  <Button size="small" onClick={handleOverviewSelected} fullWidth sx={{
                    ...(overviewSelected && { backgroundColor: "blue", color: "white" }),
                }}>Overview</Button>}
               
            </Box>
            <Box>
                {trackerSelected && <WorkItems/>}
                {reportsSelected && <Reports/>}
                {overviewSelected && <Overview/>}
            </Box>
        </Box>
    )

}
"use client"

import { Box, Button } from "@mui/material";
import { useState } from "react";
import WorkItems from "./create";
import Reports from "./reports";
import  Overview  from "./overview";

export default function Page () {
    const [trackerSelected, setTrackerSelected] = useState(true);
    const [reportsSelected, setReportsSelected] = useState(false);
    const [overviewSelected,setOverviewSelected] = useState(false)
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
  
   

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Button size="small" onClick={handleTrackerSelected} fullWidth sx={{
                    ...(trackerSelected && { backgroundColor: "blue", color: "white" }),
                }} >Tracker</Button>
                <Button size="small" onClick={handleReportsSelected} fullWidth sx={{
                    ...(reportsSelected && { backgroundColor: "blue", color: "white" }),
                }}>Reports</Button>
                                <Button size="small" onClick={handleOverviewSelected} fullWidth sx={{
                    ...(overviewSelected && { backgroundColor: "blue", color: "white" }),
                }}>Overview</Button>
               
            </Box>
            <Box>
                {trackerSelected && <WorkItems/>}
                {reportsSelected && <Reports/>}
                {overviewSelected && <Overview/>}
            </Box>
        </Box>
    )

}
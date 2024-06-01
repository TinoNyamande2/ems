"use client"

import { Box, Button } from "@mui/material";
import { useState } from "react";
import WorkItems from "./create";
import Reports from "./reports";

export default function Page () {
    const [trackerSelected, setTrackerSelected] = useState(true);
    const [reportsSelected, setReportsSelected] = useState(false);
    const handleTrackerSelected = () => {
        setTrackerSelected(true);
        setReportsSelected(false);
    }
    const handleReportsSelected = () => {
        setTrackerSelected(false);
        setReportsSelected(true);
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
               
            </Box>
            <Box>
                {trackerSelected && <WorkItems/>}
                {reportsSelected && <Reports/>}
            </Box>
        </Box>
    )

}
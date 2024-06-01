"use client"

import { Box, Button } from "@mui/material";
import { useState } from "react";
import Apply from "./apply";
import Applications from "./applications";
import Approve from "./approve";
import Overview from "./overview";

export default function Page () {
    const [applySelected, setApplySelected] = useState(false);
    const [applicationsSelected, setApplicationsSelected] = useState(true);
    const [approveSelected, setApproveSelected] = useState(false);
    const [overviewSelected, setOverviewSelected] = useState(false);
    const handleApplySelected = () => {
        console.log("Clicked")
        setApplySelected(true);
        setApplicationsSelected(false);
        setApproveSelected(false);
        setOverviewSelected(false);
    }
    const handleApplicationsSelected = () => {
        setApplySelected(false);
        setApplicationsSelected(true);
        setApproveSelected(false);
        setOverviewSelected(false); 
    }
    const handleApproveSelected = () => {
        setApplySelected(false);
        setApplicationsSelected(false);
        setApproveSelected(true);
        setOverviewSelected(false);
    }
    const handleOverviewSelected = () => {
        setApplySelected(false);
        setApplicationsSelected(false);
        setApproveSelected(false);
        setOverviewSelected(true);
    }

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Button size="small" onClick={handleApplicationsSelected} fullWidth sx={{
                    ...(applicationsSelected && { backgroundColor: "blue", color: "white" }),
                }} >Leave Applications</Button>
                <Button size="small" onClick={handleApplySelected} fullWidth sx={{
                    ...(applySelected && { backgroundColor: "blue", color: "white" }),
                }}>Apply</Button>
                <Button size="small" onClick={handleApproveSelected} fullWidth sx={{
                    ...(approveSelected && { backgroundColor: "blue", color: "white" }),
                }}>Approve Applications</Button>
                <Button size="small" onClick={handleOverviewSelected} fullWidth sx={{
                    ...(overviewSelected && { backgroundColor: "blue", color: "white" }),
                }}>Overview</Button>
            </Box>
            <Box>
                {applicationsSelected && <Applications/>}
                {applySelected && <Apply/>}
                {approveSelected && <Approve />}
                {overviewSelected && <Overview  />}
            </Box>
        </Box>
    )

}
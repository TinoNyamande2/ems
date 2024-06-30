import { Box, Typography } from "@mui/material";
import { pageContainer } from "../../../components/styyle";
import { PageHeader } from "../../../components/nav/pageHeader";

export default function Page() {
    return (
        <Box sx={pageContainer}>
            <PageHeader message="Unathorized" />
            <Box sx={{marginTop:"5vh"}}>
                <Typography sx={{ textAlign: "center",color:"red"}}>You are not authorized to access this page</Typography>
            </Box>
        </Box>
    )
}
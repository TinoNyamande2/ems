import { Box, Typography } from "@mui/material"

export const PageHeader = ({ message }: { message: string }) => {
    return (
        <Box sx={{backgroundColor:"lightgray",padding:"2%"}}>
            <Typography sx={{ textAlign: "center", fontSize: "1.5em", fontWeight: "bold" }}>{message}</Typography>
        </Box>
    )
}
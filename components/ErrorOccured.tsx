import { Box, Typography } from "@mui/material"

export const ErrorOccured = ({message}:{message:string}) => {
    return (<Box sx={{ marginLeft: "auto", marginRight: "auto", width: "80%",marginTop:"15vh" }}>
        <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.3em",color:"red" }}>
            Error Occured
        </Typography>
        <Typography sx={{ textAlign: "center",color:"red" }}>
            {message}
        </Typography>
    </Box>
    )
}
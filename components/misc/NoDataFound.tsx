import { Box, Typography } from "@mui/material"

export const NoDataFound = ({message}:{message:string}) => {
    return (<Box sx={{ marginLeft: "auto", marginRight: "auto", width: "80%",marginTop:"15vh" }}>
        <Typography sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.3em" }}>
            No Data Found
        </Typography>
        <Typography sx={{ textAlign: "center" }}>
            {message}
        </Typography>
    </Box>
    )
}
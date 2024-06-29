import { Box, Grid, TextField, Button } from "@mui/material";


export default function Page () {

    return (
        <> <Box sx={{ width: "100%", padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="user-input">User</label>
              <TextField
                id="user-input"
                size="small"
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="leave-type-input">Leave Type</label>
              <TextField
                id="leave-type-input"
                size="small"
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label>&nbsp;</label>
              <Button
                size="small"
                variant="contained"
                sx={{ flex: "1" }}
              >
                Search
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
            fullWidth
              size="small"
              variant="contained"
              color="error"
              sx={{ flex: "1" }}
            >
              Clear Search
            </Button>
          </Grid>
        </Grid>
      </Box></>
        
    )
}
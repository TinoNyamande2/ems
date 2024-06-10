import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'

export default function Page() {

  return (
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh', 
    }}
>
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '30vh', 
            width: '30%',
            textAlign: 'center', 
        }}
    >
        <CircularProgress size={40} /> 
        <Typography sx={{ mt: 2, fontSize: "0.9em" }}>Loading ...</Typography> {/* Add margin-top for spacing */}
    </Box>
</Box>


  )
}  
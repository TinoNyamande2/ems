import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'

export const CircularProgressSpinner=({message}:{message:string})=> {

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Full viewport height
      width: '100%', // Full width
    }}
  >
    <CircularProgress size={80} /> {/* Increase the size of the spinner */}
    <Typography sx={{ mt: 2,fontSize:"1.5em" }}>Loading ...</Typography> {/* Add margin-top for spacing */}
  </Box>


  )
}  
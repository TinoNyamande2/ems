"use client"
import Image from "next/image";
import { useEffect } from "react";
import { getServerSession } from 'next-auth';
import {redirect} from 'next/navigation'
import { authOptions } from "../../lib/authOptions";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LatestApplications from "../../components/latestLeaveApplications";


export default  function Home() {

 const { data: session } = useSession();
  
  if(!session) {
    redirect("/login")
  }

  return (
    <Box
    id="hero"
    sx={(theme) => ({
      width: '100%',
      backgroundImage:
        theme.palette.mode === 'light'
          ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
          : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
      backgroundSize: '100% 20%',
      backgroundRepeat: 'no-repeat',
    })}
  >
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 14, sm: 6 },
        pb: { xs: 8, sm: 6 },
      }}
    >
      <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '90%' } }}>
        <Typography
          variant="h1"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 'clamp(3.5rem, 10vw, 4rem)',
          }}
        >
          Employee Management System&nbsp;
          <Typography
            component="span"
            variant="h1"
            sx={{
              fontSize: 'clamp(3rem, 10vw, 4rem)',
              color: (theme) =>
                theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
            }}
          >
          </Typography>
        </Typography>
        <Box
          textAlign="center"
          color="text.secondary"
          display='flex'
          flexDirection="row"
          width="100%"
          sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
        >
          <Link style={{flex:"1"}} href="/leave-applications"><Button variant="outlined" fullWidth>Apply for leave</Button></Link>
          <Link style={{flex:"1"}} href="/performance-tracker"><Button variant="outlined"  fullWidth>Performance Tracker</Button></Link>
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignSelf="center"
          spacing={1}
          useFlexGap
          sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
        >
        </Stack>
      </Stack>
      <Box
        id="image"
        sx={(theme) => ({
          mt: { xs: 8, sm: 2 },
          alignSelf: 'center',
          height: { xs: 200, sm: 700 },
          width: '100%',
          backgroundImage:
            theme.palette.mode === 'light'
              ? 'url("/static/images/templates/templates-images/hero-light.png")'
              : 'url("/static/images/templates/templates-images/hero-dark.png")',
          backgroundSize: 'cover',
          borderRadius: '10px',
          outline: '1px solid',
          outlineColor:
            theme.palette.mode === 'light'
              ? alpha('#BFCCD9', 0.5)
              : alpha('#9CCCFC', 0.1),
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
              : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
        })}
      >
        <Box sx={{marginBottom:"3vh"}}>
        <Typography sx={{textAlign:"center",fontSize:"1.5em"}} >Upcoming leave days</Typography>
        <LatestApplications/>
        </Box>
        <Box>
        <Typography sx={{textAlign:"center",fontSize:"1.5em"}}>Notifications</Typography>
        </Box>
      </Box>
    </Container>
  </Box>
  );
}

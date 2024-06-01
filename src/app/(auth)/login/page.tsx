"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signIn, signOut, useSession } from "next-auth/react"
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import { redirect } from 'next/navigation'
import { UserDefaultValues, User } from '@/interfaces/user';
import { ChangeEvent } from 'react';
import { AddUser } from '@/data/user';



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Page() {
  const [inputs, setInputs] = React.useState<User>(UserDefaultValues);
  const { data: session } = useSession();
  
  if(session) {
    redirect("/")
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputs((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }))
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await signIn("credentials", 
      { 
        email: inputs.email, 
        password: inputs.password, 
        redirect: false
       })
       console.log(response)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href={`/signup`} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Button fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }} onClick={() => signIn('google')} >Sign in with Google</Button>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
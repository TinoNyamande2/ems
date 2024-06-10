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
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { UserDefaultValues, User } from '@/interfaces/user';
import { ChangeEvent } from 'react';
import { ToastNotificationSuccess, ToastNotificationError } from '../../../../components/ToastNotification';
import { CircularProgressSpinner } from '../../../../components/CircularProgress';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Page() {
  const [inputs, setInputs] = React.useState<User>(UserDefaultValues);
  const [formErrors, setFormErrors] = React.useState<User>(UserDefaultValues);
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [errorToastOpen, setErrorToastOpen] = React.useState(false);
  const [errorSavingData, setErrorSavingData] = React.useState("");

  React.useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormErrors((prevInputs) => ({ ...prevInputs, [event.target.name]: "" }));
    setInputs((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    let valid = true;
    if(!inputs.email && !inputs.password) {
      setFormErrors((prevInputs) => ({ ...prevInputs, ['password']: "Password  is required" }))
      setFormErrors((prevInputs) => ({ ...prevInputs, ['email']: "Email is required" }))
      valid=false;
    }
    if (!inputs.email) {
      setFormErrors((prevErrors) => ({ ...prevErrors, email: "Email is required" }));
      valid = false;
    } else if (!validateEmail(inputs.email)) {
      setFormErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email address" }));
      valid = false;
    }

    if (!inputs.password) {
      setFormErrors((prevErrors) => ({ ...prevErrors, password: "Password is required" }));
      valid = false;
    } else if (!validatePassword(inputs.password)) {
      setFormErrors((prevErrors) => ({ ...prevErrors, password: "Password must be at least 8 characters" }));
      valid = false;
    }

    if (!valid) return;
    setIsSaving(true);
    try {
      const response = await signIn("credentials", {
        email: inputs.email,
        password: inputs.password,
        redirect: false
      });
      
      if (!response?.ok) {
        throw new Error(response?.error ?? "An unknown error occured");
      } else {
        setOpen(true);
        router.push("/");
      }
    } catch (error) {
      setErrorSavingData((error as Error).message);
      setErrorToastOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClick = () => {
    setOpen(false);
    setErrorToastOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <ToastNotificationSuccess message={"Log in successful"} isOpen={open} handleClick={handleClick} duration={3000} />
        <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClick} duration={9000} />
        <CssBaseline />
        {isSaving ? (
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
            <CircularProgressSpinner message='Signin' />
          </div>
        ) : (
          <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="off"
                  autoFocus
                  onChange={handleChange}
                />
                {formErrors.email && <Typography sx={{color:"red",fontSize:"0.8em"}} >{formErrors.email}</Typography>}
              </Box>

              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="off"
                  onChange={handleChange}
                />
                {formErrors.password && <Typography sx={{color:"red",fontSize:"0.8em"}}>{formErrors.password}</Typography>}
              </Box>
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
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => signIn('google')}
                >
                  Sign in with Google
                </Button>
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

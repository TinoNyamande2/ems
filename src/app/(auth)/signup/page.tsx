"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { CircularProgressSpinner } from '../../../../components/misc/CircularProgress';
import Grid from '@mui/material/Grid';
import { ToastNotificationSuccess, ToastNotificationError } from '../../../../components/misc/ToastNotification';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getServerSession } from 'next-auth';
import { signIn, signOut, useSession } from "next-auth/react"
import { authOptions } from '../../../../lib/authOptions';
import { redirect, useRouter } from 'next/navigation'
import { UserDefaultValues, User } from '@/interfaces/user';
import { ChangeEvent } from 'react';
import { AddUser } from '@/data/user';

const defaultTheme = createTheme();

export default function SignUp() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [errorToastOpen, setErrorToastOpen] = React.useState(false);
  const [errorSavingData, setErrorSavingData] = React.useState("");
  const router = useRouter();

  const { data: session } = useSession();


  React.useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);
  const [inputs, setInputs] = React.useState<User>(UserDefaultValues);
  const [formErrors, setFormErrors] = React.useState<User>(UserDefaultValues);

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
    if (!inputs.name) {
      setFormErrors((prevErrors) => ({ ...prevErrors, name: "Name is required" }));
      valid = false;
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

    if (inputs.password !== inputs.confirmpassword) {
      console.log(inputs)
      setFormErrors((prevErrors) => ({ ...prevErrors, confirmpassword: "Passwords do not match" }));
      valid = false;
    }

    if (!valid) return;
    setIsSaving(true);
    try {
      await AddUser(inputs);
      setOpen(true);
      setTimeout(() => {
        router.push("/");
      }, 3000); 
    }catch (error) {
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
        <ToastNotificationSuccess message={"Sign up successful"} isOpen={open} handleClick={handleClick} duration={3000} />
        <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClick} duration={9000} />
        <CssBaseline />
        {isSaving ? (
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
            <CircularProgressSpinner message='Signup' />
          </div>
        ) : (
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
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    onChange={handleChange}
                    autoFocus
                  />
                  {formErrors.name && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{formErrors.name}</Typography>}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onChange={handleChange}
                  />
                  {formErrors.email && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{formErrors.email}</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handleChange}
                  />
                  {formErrors.password && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{formErrors.password}</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmpassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    onChange={handleChange}
                  />
                  {formErrors.confirmpassword && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{formErrors.confirmpassword}</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="Remember me"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Button fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }} onClick={() => signIn('google')} >Continue with Google</Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

"use client"
import { useState, useEffect, SyntheticEvent } from 'react';
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
import { ToastNotificationSuccess, ToastNotificationError } from '../../../../components/misc/ToastNotification';
import { CircularProgressSpinner } from '../../../../components/misc/CircularProgress';
import { ForgotEmailModal } from '../../../../components/auth/forgotemail';
import { createForgotPasswordResetLink } from '@/data/user';

const defaultTheme = createTheme();

export default function Page() {
  const [inputs, setInputs] = useState<User>(UserDefaultValues);
  const [formErrors, setFormErrors] = useState<User>(UserDefaultValues);
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageToastOpen, setSuccessMessageToastOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageToastOpen, setErrorMessageToastOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("")
  const [isLoadingOpen, setIsLoadingOpen] = useState(false)

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleModalClick = () => {
    setPasswordModalOpen(!passwordModalOpen);
  }
  const handleForgotPassword = async (email: string) => {
    setPasswordModalOpen(false);
    setLoadingMessage("Sending link...")
    setIsLoadingOpen(true)
    try {
      await createForgotPasswordResetLink(email);
      setSuccessMessageToastOpen(true)
      setSuccessMessage(`Password reset link has been sent to ${email}`);
      console.log("sent")
    } catch (error) {
      setErrorMessage((error as Error).message);
      setErrorMessageToastOpen(true);
    } finally {
      setLoadingMessage("")
      setIsLoadingOpen(false)
    }
  }

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

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    let valid = true;
    if (!inputs.email && !inputs.password) {
      setFormErrors((prevInputs) => ({ ...prevInputs, ['password']: "Password  is required" }))
      setFormErrors((prevInputs) => ({ ...prevInputs, ['email']: "Email is required" }))
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

    if (!valid) return;
    setLoadingMessage("Signing in")
    setIsLoadingOpen(true)
    try {
      const response = await signIn("credentials", {
        email: inputs.email,
        password: inputs.password,
        redirect: false
      });

      if (!response?.ok) {
        throw new Error(response?.error ?? "An unknown error occured");
      } else {
        setSuccessMessage("Logged in successfully")
        setSuccessMessageToastOpen(true);
        router.push("/");
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
      setErrorMessageToastOpen(true);
    } finally {
      setIsLoadingOpen(false)
    }
  };

  const handleClick = () => {
    setErrorMessageToastOpen(false);
    setSuccessMessageToastOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <ForgotEmailModal isOpen={passwordModalOpen} handleClose={handleModalClick} handlePasswordReset={handleForgotPassword} />
        <ToastNotificationSuccess message={successMessage} isOpen={successMessageToastOpen} handleClick={handleClick} duration={3000} />
        <ToastNotificationError message={errorMessage} isOpen={errorMessageToastOpen} handleClick={handleClick} duration={9000} />
        {isLoadingOpen?( <CircularProgressSpinner message={loadingMessage} />):(<>
        <CssBaseline />

        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
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
              {!passwordModalOpen && formErrors.email && <Typography sx={{ color: "red", fontSize: "0.8em" }} >{formErrors.email}</Typography>}
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
              {!passwordModalOpen && formErrors.password && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{formErrors.password}</Typography>}
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
              onClick={(e) => handleSubmit(e)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Button sx={{ fontSize: "0.8em" }} onClick={() => setPasswordModalOpen(true)} >
                  Forgot password?
                </Button>
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
        </Box></>)
}
      </Container>
    </ThemeProvider>
  );
}

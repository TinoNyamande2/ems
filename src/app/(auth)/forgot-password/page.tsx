"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { CircularProgressSpinner } from '../../../../components/misc/CircularProgress';
import Grid from '@mui/material/Grid';
import { ToastNotificationSuccess, ToastNotificationError } from '../../../../components/misc/ToastNotification';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { resetPassword } from '@/data/user';

const defaultTheme = createTheme();



export default function Page() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorToastOpen, setErrorToastOpen] = useState(false);
    const [errorSavingData, setErrorSavingData] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [token, setToken] = useState("")

    const searchParams = useSearchParams();
    const tokenValue = searchParams.get("token") || "";
    useEffect(() => {
        setToken(tokenValue)
    }, [searchParams, tokenValue])



    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setPasswordError("");
        setConfirmPasswordError("")
        let valid = true;

        if (!password) {
            setPasswordError("Password is required");
            valid = false;
        } else if (!validatePassword(password)) {
            setPasswordError("Password must be at least 8 characters");
            valid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            valid = false;
        }

        if (!valid) return;
        setIsSaving(true);
        try {
            await resetPassword(token, password)
            setOpen(true);
            router.push("/login");
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
        <React.Suspense fallback={<CircularProgressSpinner message='Loading'/>} >
            <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <ToastNotificationSuccess message={"Password has been changed successfully"} isOpen={open} handleClick={handleClick} duration={3000} />
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
                            Update Password
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="New Password"
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {passwordError && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{passwordError}</Typography>}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmpassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    {confirmPasswordError && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{confirmPasswordError}</Typography>}
                                </Grid>

                            </Grid>
                            <Button
                                onClick={(e) => handleSubmit(e)}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </Box>
                )}
            </Container>
        </ThemeProvider>
        </React.Suspense>
    );
}
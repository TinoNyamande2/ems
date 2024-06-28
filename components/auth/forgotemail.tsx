"use client"

import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useState } from "react"


export const ForgotEmailModal = ({ isOpen, handleClose, handlePasswordReset }: { isOpen: boolean, handleClose: () => void, handlePasswordReset: (email: string) => void }) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const [message, setMessage] = useState('');
    const handleReset = () => {
        setEmailError("")
        if (!email) {
            setEmailError("Email is required");
            return
        } else if (!validateEmail(email)) {
            setEmailError("Invalid email address");
            return
        }
        handlePasswordReset(email)
    }

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
            }}>
                <Typography variant="h6" component="h2">Forgot Password</Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                    <TextField
                        label="Enter email address"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <Typography sx={{ color: "red", fontSize: "0.8em", textAlign: "center" }}>{emailError}</Typography>}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={() => handleReset()}>Send Reset Link</Button>
                        <Button variant="outlined" sx={{ backgroundColor: "red", color: "white" }} onClick={handleClose}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}


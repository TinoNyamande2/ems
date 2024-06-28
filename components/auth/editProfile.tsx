"use client"

import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useState } from "react"
import { ToastNotificationError, ToastNotificationSuccess } from '../misc/ToastNotification';


export const ChangePasswordModal = ({ isOpen, handleClose, handlePasswordReset }: { isOpen: boolean, handleClose: () => void, handlePasswordReset: (oldPassword: string, newPassword: string) => void }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorToastOpen, setErrorToastOpen] = useState(false);
    const [errorSavingData, setErrorSavingData] = useState("");

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };
    const handleSubmit = async () => {
        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmNewPasswordError("")
        if (!oldPassword) {
            setOldPasswordError("Password is required");
            return
        }

        if (!newPassword) {
            setNewPasswordError("Password is required");
            return
        } else if (!validatePassword(newPassword)) {
            setNewPasswordError("Password must be at least 8 characters");
            return
        }

        if (newPassword !== confirmNewPassword) {
            setConfirmNewPasswordError("Passwords do not match");
            return
        }
        handlePasswordReset(oldPassword,newPassword)
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={{
                position: 'absolute', top: '20%', left: '50%',
                width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 10,
            }}>
                <ToastNotificationSuccess message={"Sign up successful"} isOpen={open} handleClick={handleClose} duration={3000} />
                <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClose} duration={9000} />
                <Typography sx={{ paddingBottom: "6vh" }} variant="h6" component="h2">Change Password</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="oldpassword"
                            required
                            fullWidth
                            id="name"
                            type="password"
                            label="Old Password"
                            onChange={(e) => setOldPassword(e.target.value)}
                            autoFocus
                        />
                        {oldPasswordError && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{oldPasswordError}</Typography>}
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            type="password"
                            label="New Password"
                            name="newpassword"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {newPasswordError && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{newPasswordError}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Confirm New Password"
                            type="password"
                            id="password"
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        {confirmNewPasswordError && <Typography sx={{ color: "red", fontSize: "0.8em" }}>{confirmNewPasswordError}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleSubmit} sx={{ color: "white", backgroundColor: "blue" }} fullWidth>Save</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleClose} sx={{ color: "white", backgroundColor: "red" }} fullWidth>Cancel</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    )
}


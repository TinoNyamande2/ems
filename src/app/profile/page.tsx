"use client"
import { useEffect } from "react";
import { redirect } from 'next/navigation'
import { useSession } from "next-auth/react"
import * as React from 'react';
import { Paper, Table, TableCell, TableContainer, TableHead, TableRow, alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { changePassword, getUserByEmail } from "@/data/user";
import { QueryResultRow } from "@vercel/postgres";
import { useQuery } from "react-query";
import { useState } from "react";
import { SmallCircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { ErrorOccured } from "../../../components/misc/ErrorOccured";
import { ToastNotificationSuccess, ToastNotificationError } from "../../../components/misc/ToastNotification";
import { ChangePasswordModal } from "../../../components/auth/editProfile";


export default function Home() {

  const { data: session } = useSession();
  const useremail = session?.user?.email;
  const [user, setUser] = React.useState<QueryResultRow | undefined>(undefined);
  const [editProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false)
  const [errorToastMessage, setErrorToastMessage] = useState("")
  const [successToastOpen, setSuccessToastOpen] = useState(false)
  const [successToastMessage, setSuccessToastMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [savingMessage, setSavingMessage] = useState("")


  const handleToastClick = () => {
    setSuccessToastOpen(false);
    setErrorToastOpen(false)
  }
  const handleEditProfileModalClick = () => {
    setEditProfileModalOpen(!editProfileModalOpen)
  }
  const handleReset = async (oldPassword: string, newPassword: string) => {
    setIsSaving(true)
    try {
      setEditProfileModalOpen(false)
      await changePassword(useremail, oldPassword, newPassword)
      setSuccessToastMessage("Password changed successfully");
      setSuccessToastOpen(true)
    } catch (error) {
      setErrorToastMessage((error as Error).message);
      setErrorToastOpen(true)
    } finally {
      setIsSaving(false)
    }
  }

  const fetchUser = () => getUserByEmail(useremail);

  const { data, isError, isLoading, error } = useQuery(
    [useremail],
    fetchUser,
    {
      enabled: !!useremail,
    }
  );
  useEffect(() => {
    if (!isLoading) {
      setUser(data);
    }
  }, [session, isLoading, data, user])
  if (!session) {
    redirect("/login")
  }

  if (isError) {
    return (
      <ErrorOccured message={(error as Error).message} />
    )
  }

  return (
    <>
      {isSaving ? (<SmallCircularProgressSpinner message="Saving" />) : (
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
          <ToastNotificationSuccess message={successToastMessage} isOpen={successToastOpen} handleClick={handleToastClick} duration={4000} />
          <ToastNotificationError message={errorToastMessage} isOpen={errorToastOpen} handleClick={handleToastClick} duration={4000} />
          <Box>
            <Box sx={{ paddingBottom: "4vh", borderBottom: "solid 1px black" }}>
              <Typography sx={{ textAlign: "center", fontSize: "1.3em", fontWeight: "bold" }}>My Profile</Typography>
            </Box>
            <Box sx={{ width: "50%", paddingTop: "4vh", marginLeft: "auto", marginRight: "auto" }}>
              <Button onClick={handleEditProfileModalClick} fullWidth size="small" sx={{ textAlign: "center", fontSize: "0.9em", color: "white", backgroundColor: "blue" }}>Change Password</Button>
              {/* <Button onClick={handleEditProfileModalClick} fullWidth size="small" sx={{ textAlign: "center", fontSize: "0.9em", color: "white", backgroundColor: "blue" }}>Edit Profile</Button>
              <Button onClick={handleEditProfileModalClick} fullWidth size="small" sx={{ textAlign: "center", fontSize: "0.9em", color: "white", backgroundColor: "blue" }}>Edit Company Info</Button>
              <Button onClick={handleEditProfileModalClick} fullWidth size="small" sx={{ textAlign: "center", fontSize: "0.9em", color: "white", backgroundColor: "blue" }}>Change Password</Button> */}

            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{user?.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>{user?.organisationname}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{user?.useremail}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>{user?.role}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <ChangePasswordModal isOpen={editProfileModalOpen} handleClose={handleEditProfileModalClick} handlePasswordReset={handleReset} />
          </Box>
        </Box>
      )}
    </>

  );
}

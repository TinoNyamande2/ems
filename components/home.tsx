"use client"
import { useEffect } from "react";
import { redirect, useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"
import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LatestApplications, { OnLeaveApplications } from "./leaveapplication/latestLeaveApplications";
import { Notifications } from "./misc/Notifications";
import { getUserByEmail } from "@/data/user";
import { QueryResultRow } from "@vercel/postgres";
import { useQuery } from "react-query";
import { createCompany } from "@/data/company";
import { AddCompanyModal } from "./org/addCompanyModal";
import { CompanyCreate } from "@/interfaces/company";
import { InviteMemberModal } from "./org/inviteMemberModal";
import { createInvite } from "@/data/invites";
import { CircularProgressSpinner } from "./misc/CircularProgress";
import { ErrorOccured } from "./misc/ErrorOccured";
import { ToastNotificationError, ToastNotificationSuccess } from "./misc/ToastNotification";
import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { pageContainer } from "./styyle";
import { PageHeader } from "./nav/pageHeader";
import Link from "next/link";


export default function Home() {
  const { data: session } = useSession();
  const useremail = session?.user?.email;
  const [user, setUser] = useState<QueryResultRow | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { username, name, role, organisation,organisationid, setName, setOrganisation, setRole, setUsername, setOrganisationId } = useUserContext();




  const fetchUser = () => getUserByEmail(useremail);

  const { data, isError, isLoading, error,refetch } = useQuery(
    [useremail],
    fetchUser,
    {
      enabled: !!useremail,
    }
  );

  useEffect(() => {
    if (!isLoading) {
      setUser(data)
      setUsername(data?.useremail || "");
      setName(data?.username || "");
      setRole(data?.role || "");
      setOrganisation(data?.organisationname || "");
      setOrganisationId(data?.organisationid || "")
    }
  }, [session, isLoading, data, user, setName, setOrganisation,organisationid, setOrganisationId, setRole, setUsername, error, isError]);



  if (isError) {
    return <ErrorOccured message={(error as Error).message} />;
  }
  if(isLoading) {
    return (<CircularProgressSpinner message="Loadding"/>)
  }
  const handleClick = () => setOpen(!open);
  const handleToastClick = () => {
    setSuccessToastOpen(false);
    setErrorToastOpen(false);
  };
  const handleMemberModalClick = () => setMemberModalOpen(!memberModalOpen);

  const handleInviteMember = async (email: string) => {
    setMemberModalOpen(false);
    setIsSaving(true);
    try {
      await createInvite(email, session?.user?.email, user?.organisationid);
      setSuccessToastMessage("Invite sent successfully");
      setSuccessToastOpen(true);
    } catch (error) {
      setErrorToastMessage((error as Error).message);
      setErrorToastOpen(true);
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <>
      {isSaving && <CircularProgressSpinner message="Saving" />}
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
        {user?.organisationname &&
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: { xs: 14, sm: 6 },
              pb: { xs: 8, sm: 6 },
            }}
          >
            <Stack spacing={2} useFlexGap sx={{ marginBottom: "20vh", height: "auto", width: { xs: '100%', sm: '90%' } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    flexGrow: "1",
                    fontSize: '3em',
                    marginBottom: '0.5em',
                  }}
                >
                  Employee Management System
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '1.5em',
                    flexGrow: "1",
                  }}
                >
                  {user.username} - {user.organisationname}
                </Typography>
              </Box>
              {user?.role === "admin" && (
                <Box
                  textAlign="center"
                  color="text.secondary"
                  display='flex'
                  flexDirection="row"
                  width="100%"
                  sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' }, flexGrow: "1" }}
                >
                  <Button onClick={handleMemberModalClick} variant="outlined" fullWidth>
                    Invite members
                  </Button>
                </Box>
              )}
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
              <Box sx={{ marginBottom: "5vh" }}>
                <Typography sx={{ textAlign: "center", fontSize: "1.5em" }}>
                  Upcoming leave days
                </Typography>
                {user && <LatestApplications organisation={user.organisationid} />}
              </Box>
              <Box sx={{ marginBottom: "5vh" }}>
                <Typography sx={{ textAlign: "center", fontSize: "1.5em" }}>
                  Employees On Leave
                </Typography>
                {user && <OnLeaveApplications organisation={user.organisationid} />}
              </Box>
              <Box sx={{ marginBottom: "5vh" }}>
                <Typography sx={{ textAlign: "center", fontSize: "1.5em" }}>
                  Notifications
                </Typography>
                <Notifications organisation={user.organisationid} user={user.useremail} />
              </Box>
            </Box>
          </Container>
        }
        {!isSaving && user && !user.organisationname &&
          <Box sx={pageContainer}>
            <PageHeader message={`Welcome ${session?.user?.name}`} />
            <Box sx={{ marginTop: "3vh" }}>
              <Box sx={{padding:"6"}}>
                <Typography sx={{textAlign:"center",fontSize:"1.4em",marginBottom:"4vh"}}>You dont appear to belong to any organisation</Typography>
              </Box>
              <Button fullWidth sx={{ backgroundColor: "blue", color: "white" }}><Link style={{width:"100%",textDecoration:"none",color:"white"}} href="/create-company">Register Organisation</Link></Button>
            </Box>
          </Box>
        }

        <InviteMemberModal memberModalOpen={memberModalOpen} onInviteMember={handleInviteMember} onModalClose={handleMemberModalClick} />
      </Box>

    </>
  );
}

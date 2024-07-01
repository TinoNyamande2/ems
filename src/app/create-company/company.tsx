"use client"
import { Button, Modal, TextField, Box } from "@mui/material";
import { useState } from "react";
import { SmallCircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { useUserContext } from "@/context/userContext";
import { createCompany } from "@/data/company";
import { CompanyCreate } from "@/interfaces/company";
import { ToastNotificationSuccess, ToastNotificationError } from "../../../components/misc/ToastNotification";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export const AddCompany = () => {
    const [companyName, setCompanyName] = useState("")
    const [isSaving, setIsSaving] = useState(false);
    const [errorToastOpen, setErrorToastOpen] = useState(false);
    const [errorToastMessage, setErrorToastMessage] = useState("");
    const [successToastOpen, setSuccessToastOpen] = useState(false);
    const [successToastMessage, setSuccessToastMessage] = useState("");
    const { username, name, role, organisation, setName, setOrganisation, setRole, setUsername, setOrganisationId } = useUserContext();
    const router = useRouter();
    const {data: session,update:updateSession} = useSession();
    const handleAddCompany = async () => {
        const company: CompanyCreate = {
            name: companyName,
            userid: username,
        };
        try {
            setIsSaving(true);
            const org = await createCompany(company);
            setOrganisationId(org.id)
            await updateSession({ ...session, user: { ...session?.user, organisationid: org.id } });
            console.log("Session",session?.user)
            setSuccessToastMessage("Organisation created successfully");
            setSuccessToastOpen(true);
            setTimeout(() => {
                router.push(`/`);
            }, 2000);
        } catch (error) {
            setErrorToastMessage((error as Error).message);
            setErrorToastOpen(true);
        } finally {
            setIsSaving(false);
        }
    };
    const handleToastClick = () => {
        setSuccessToastOpen(false);
        setErrorToastOpen(false);
      };

    return (
        <Box sx={{}}>
            {!isSaving ? (<Box>
                <ToastNotificationSuccess message={successToastMessage} isOpen={successToastOpen} handleClick={handleToastClick} duration={4000} />
                <ToastNotificationError message={errorToastMessage} isOpen={errorToastOpen} handleClick={handleToastClick} duration={4000} />
                <Box sx={{ marginBotton: "4vh" }}>
                    <TextField fullWidth size="small" name="companyName" onChange={(e) => setCompanyName(e.target.value)} label="Organisation Name" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", marginTop: "5vh" }}>
                    <Button fullWidth sx={{ backgroundColor: "blue", color: "white" }} variant="outlined" onClick={handleAddCompany}>Save</Button>
                </Box>
            </Box>):(
                <SmallCircularProgressSpinner message="Saving"/>
            )}

        </Box>
    )
}



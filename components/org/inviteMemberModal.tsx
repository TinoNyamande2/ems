import { Button, Modal, TextField, Box } from "@mui/material";
import { useState } from "react";


export const InviteMemberModal = ({ memberModalOpen, onInviteMember, onModalClose }: { memberModalOpen: boolean, onInviteMember: (email: string) => void, onModalClose: () => void }) => {
    const [email, setEmail] = useState("")
    const onAdd = () => {
        onInviteMember(email)
    }
    return (
        <Modal open={memberModalOpen} onClose={onModalClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
            }}>
                <Box sx={{marginBotton:"4vh"}}>
                    <TextField fullWidth size="small" name="email" onChange={(e) => setEmail(e.target.value)} label="Member email address" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row",marginTop:"5vh" }}>
                    <Button fullWidth sx={{backgroundColor:"blue",color:"white" }} variant="outlined" onClick={onAdd}>Save</Button>
                    <Button fullWidth sx={{backgroundColor:"red",color:"white"}}  variant="outlined" onClick={onModalClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    )
}
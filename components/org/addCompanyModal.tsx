import { Button, Modal, TextField, Box } from "@mui/material";
import { useState } from "react";


export const AddCompanyModal = ({ open, onAddCompany, onModalClose }: { open: boolean, onAddCompany: (name: string) => void, onModalClose: () => void }) => {
    const [name, setName] = useState("")
    const onAdd = () => {
        onAddCompany(name);
    }
    return (
        <Modal open={open} onClose={onModalClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
            }}>
                <Box sx={{marginBotton:"4vh"}}>
                    <TextField fullWidth size="small" name="name" onChange={(e) => setName(e.target.value)} label="Organisation Name" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row",marginTop:"5vh" }}>
                    <Button fullWidth sx={{backgroundColor:"blue",color:"white" }} variant="outlined" onClick={onAdd}>Save</Button>
                    <Button fullWidth sx={{backgroundColor:"red",color:"white"}}  variant="outlined" onClick={onModalClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    )
}
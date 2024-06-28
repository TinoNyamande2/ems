import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';



interface AddWorkItemModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onAddItem: (projectname: string) => void;
}

const AddProjectModal: React.FC<AddWorkItemModalProps> = ({ isOpen, onRequestClose, onAddItem }) => {
    const [projectname, setProjectname] = useState('');

    const handleSubmit = () => {
        if (projectname) {
            onAddItem(projectname);
            onRequestClose();
        } else {
            throw new Error("Form invalid")
        }
    };

    return (
        <Modal open={isOpen} onClose={onRequestClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
            }}>
                <Typography variant="h6" component="h2">Add Work Item</Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                    <TextField
                        label="Project"
                        fullWidth
                        margin="normal"
                        value={projectname}
                        onChange={(e) => setProjectname(e.target.value)}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Add</Button>
                        <Button variant="outlined" color="secondary" onClick={onRequestClose}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default AddProjectModal;

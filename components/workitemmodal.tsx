// components/AddWorkItemModal.tsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
// import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Dayjs } from 'dayjs';



interface AddWorkItemModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onAddItem: (project: string, startTime: Dayjs, endTime: Dayjs,tags:string,summary:string) => void;
}

const AddWorkItemModal: React.FC<AddWorkItemModalProps> = ({ isOpen, onRequestClose, onAddItem }) => {
    const [project, setProject] = useState('');
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('')
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);

    const handleSubmit = () => {
        if (startTime && endTime) {
            onAddItem(project, startTime, endTime,tags,summary);
            console.log(project)
            console.log(startTime);
            console.log(endTime)
            setProject('');
            setStartTime(null);
            setEndTime(null);
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
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                    />
                    <TextField
                        label="Tags"
                        fullWidth
                        margin="normal"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <TextField
                        label="Summary"
                        fullWidth
                        margin="normal"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimeField']}>
                            <TimeField onChange={(newValue) => setStartTime(newValue)} label="Start Time" />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimeField']}>
                            <TimeField onChange={(newValue) => setEndTime(newValue)} label="End Time" />
                        </DemoContainer>
                    </LocalizationProvider>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Add</Button>
                        <Button variant="outlined" color="secondary" onClick={onRequestClose}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default AddWorkItemModal;

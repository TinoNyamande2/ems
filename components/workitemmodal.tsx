import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useQuery } from 'react-query';
import { getAllProjects } from '@/data/projects';
import { getAllTags } from '@/data/tags';
import { Dayjs } from 'dayjs';

interface AddWorkItemModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onAddItem: (project: string, startTime: Dayjs, endTime: Dayjs, tags: string, summary: string) => void;
}

const AddWorkItemModal: React.FC<AddWorkItemModalProps> = ({ isOpen, onRequestClose, onAddItem }) => {
    const [project, setProject] = useState('');
    const [projectsList, setProjectsList] = useState<any[]>([]);
    const [tagsList, setTagsList] = useState<any[]>([]);
    const [tags, setTags] = useState('');
    const [summary, setSummary] = useState('');
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);


    useEffect(() => {
        const fetchProject = async () => {
            const data = getAllProjects();
            setProjectsList(await data);
            console.log("Project",data)
        }
        const fetchTags = async () => {
            const data = getAllTags();
            console.log("tags",data)
            setTagsList(await data);
        }

        fetchProject();
        fetchTags();
    }, []);

    // useEffect(() => {
    //     if (projectsError) {
    //         console.error("Error fetching projects:", projectsError);
    //     }
    //     if (tagsError) {
    //         console.error("Error fetching tags:", tagsError);
    //     }
    // }, [projectsError, tagsError]);

    // useEffect(() => {
    //     if (!isProjectsLoading && projectsList.length === 0) {
    //         console.log("Projects list is empty, refetching...");
    //         refetchProjects();
    //     }
    //     if (!isTagsLoading && tagsList.length === 0) {
    //         console.log("Tags list is empty, refetching...");
    //         refetchTags();
    //     }
    // }, [projectsList, tagsList, isProjectsLoading, isTagsLoading, refetchProjects, refetchTags]);

    const handleSubmit = () => {
        if (startTime && endTime && project && tags && summary) {
            onAddItem(project, startTime, endTime, tags, summary);
            setProject('');
            setTags('');
            setSummary('');
            setStartTime(null);
            setEndTime(null);
            onRequestClose();
        } else {
            console.error("Form invalid");
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
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="project-label">Project</InputLabel>
                        <Select
                            labelId="project-label"
                            value={project}
                            onChange={(e) => setProject(e.target.value as string)}
                        >
                            {projectsList.map((project) => (
                                <MenuItem key={project.id} value={project.id}>
                                    {project.projectname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="tag-label">Tag</InputLabel>
                        <Select
                            labelId="tag-label"
                            value={tags}
                            onChange={(e) => setTags(e.target.value as string)}
                        >
                            {tagsList.map((tag) => (
                                <MenuItem key={tag.id} value={tag.id}>
                                    {tag.tagname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Summary"
                        fullWidth
                        margin="normal"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimeField']}>
                            <TimeField
                                label="Start Time"
                                value={startTime}
                                onChange={(newValue) => setStartTime(newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['TimeField']}>
                            <TimeField
                                label="End Time"
                                value={endTime}
                                onChange={(newValue) => setEndTime(newValue)}
                            />
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

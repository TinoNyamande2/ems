"use client";
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl } from '@mui/material';
import { useRouter } from 'next/navigation';
import { CircularProgressSpinner } from '../../../../components/misc/CircularProgress';
import { ToastNotificationError, ToastNotificationSuccess, ToastNotificationWarning } from '../../../../components/misc/ToastNotification';
import { ErrorOccured } from '../../../../components/misc/ErrorOccured';
import Link from 'next/link';
import { getAllProjects } from '@/data/projects';
import { getAllTags } from '@/data/tags';
import "./../../globals.css"
import { Dayjs } from 'dayjs';
import { useSession } from "next-auth/react";
import { QueryResultRow } from '@vercel/postgres';
import { format } from 'date-fns';
import { ChangeEvent } from 'react';
import { deletePerformance, editPerformance, getPerformanceById } from '@/data/perfomance';
import { differenceInMinutes } from 'date-fns';
import { PerfomanceEdit } from '@/interfaces/performance';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { getUserByEmail } from '@/data/user';


export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [performance, setPerformance] = useState<QueryResultRow | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorToastOpen, setErrorToastOpen] = useState(false);
    const [warningToastOpen, setWarningToastOpen] = useState(false);
    const [errorSavingData, setErrorSavingData] = useState("");
    const [projectsList, setProjectsList] = useState<any[]>([]);
    const [tagsList, setTagsList] = useState<any[]>([]);
    const [startTime, setStartTime] = useState(new Date().toISOString());
    const [endTime, setEndTime] = useState(new Date().toISOString());
    const [startTimeEdit, setStartTimeEdit] = useState<Dayjs | null>(null);
    const [endTimeEdit, setEndTimeEdit] = useState<Dayjs | null>(null);
    const router = useRouter();
    const [user, setUser] = useState<QueryResultRow | undefined>(undefined);

    const { data, isLoading, isError, error } = useQuery(['performance', id], () => getPerformanceById(id));
    const { data: session } = useSession();
    const useremail = session?.user?.email;

    useEffect(() => {
        if (!isLoading && data) {
            setPerformance(data);
            setStartTime(data.starttime);
            setEndTime(data.endtime)
        }
    }, [data, isLoading]);
    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserByEmail(useremail);
            if (userData) {
                console.log("UserData", userData)
                setUser(userData)
            }
        }
        fetchUser();
    }, [useremail]);
    useEffect(() => {

        const fetchProject = async () => {
            const data = await getAllProjects(user?.organisationid);
            console.log("Projects", data)
            setProjectsList(await data);
        }
        const fetchTags = async () => {
            const data = await getAllTags(user?.organisationid);
            console.log("Tags", data)
            setTagsList(await data);
        }

        fetchProject();
        fetchTags();
    }, [user]);

    const handleClick = () => {
        setOpen(false);
        setErrorToastOpen(false);
        setWarningToastOpen(false);
    };

    const onDelete = async () => {
        setIsSaving(true);
        try {
            await deletePerformance(id);
            setWarningToastOpen(true);
            setTimeout(() => {
                router.push("/performance-tracker");
            }, 3000);
        } catch (error) {
            console.error('Error deleting application:', error);
            setErrorSavingData((error as Error).message);
            setErrorToastOpen(true);
        } finally {
            setIsSaving(false);
        }
    };

    const onUpdate = async () => {
        setIsSaving(true);
        try {
            if (startTimeEdit) {
                setPerformance((prevValues) => ({ ...prevValues, ['starttime']: startTimeEdit.toISOString() }))
            }
            if (endTimeEdit) {
                setPerformance((prevValues) => ({ ...prevValues, ['endtime']: endTimeEdit.toISOString() }))
            }
            const totalHours = differenceInMinutes(new Date(performance?.endtime), new Date(performance?.starttime)) / 60;
            const editMyPerformance: PerfomanceEdit = {
                id: id,
                starttime: startTimeEdit ? startTimeEdit.toISOString() : performance?.starttime,
                endtime: endTimeEdit ? endTimeEdit.toISOString() : performance?.endtime,
                project: performance?.project,
                totalhours: totalHours.toString(),
                date: performance?.date,
                tags: performance?.tags,
                summary: performance?.summary,
                username: performance?.username
            }
            editPerformance(editMyPerformance);
            console.log(editMyPerformance)
            setOpen(true);
            setTimeout(() => {
                router.push("/performance-tracker");
            }, 3000);
        } catch (error) {
            setErrorSavingData((error as Error).message);
            setErrorToastOpen(true);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <CircularProgressSpinner message="Loading Data" />;
    }

    if (isError) {
        console.error('Error loading application:', error);
        return <ErrorOccured message={(error as Error).message} />;
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPerformance((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }))
    };
    const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPerformance((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }))
    }
    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        console.log(performance)
    }
    const updateStartTime = (val: Dayjs | null) => {
        setPerformance((prevValues) => ({ ...prevValues, ['starttime']: val?.toISOString() }))
    }
    const updateEndTime = (val: Dayjs | null) => {
        setPerformance((prevValues) => ({ ...prevValues, ['endtime']: val?.toISOString() }))
        setPerformance((prevValues) => ({ ...prevValues, ['starttime']: val?.toISOString() }))

    }

    return (
        <div className="max-w-md mx-auto mt-8">
            {isSaving ? (<CircularProgressSpinner message='Saving'/>) : (
                <>
                    <ToastNotificationSuccess message="Entry Updated Successfully" isOpen={open} handleClick={handleClick} duration={6000} />
                    <ToastNotificationWarning message="Entry Deleted Successfully" isOpen={warningToastOpen} handleClick={handleClick} duration={6000} />
                    <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClick} duration={6000} />
                    <Box sx={{ marginTop: "3vh" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >Update Entry</Typography>
                    </Box>            {isSaving && <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
                        <CircularProgressSpinner message='Saving' />
                    </div>}

                    {performance && <Box sx={{

                    }}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <Typography id="project-label">Project : {performance.projectname}</Typography>
                            <FormControl fullWidth margin="normal">
                                <Select
                                    labelId="project-label"
                                    value={performance.project}
                                    onChange={(e) => setPerformance((prevInputs) => ({ ...prevInputs, ['project']: e.target.value as string }))}
                                >
                                    {projectsList.map((project) => (
                                        <MenuItem key={project.id} value={project.id}>
                                            {project.projectname}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <Typography>Tag :{performance.tagname}</Typography>
                                <Select
                                    labelId="tag-label"
                                    value={performance.tags}
                                    onChange={(e) => setPerformance((prevInputs) => ({ ...prevInputs, ['tags']: e.target.value as string }))}>
                                    {tagsList.map((tag) => (
                                        <MenuItem key={tag.id} value={tag.id}>
                                            {tag.tagname}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Typography>Summary : {performance.summary}</Typography>
                            <TextField
                                fullWidth
                                name="summary"
                                margin="normal"
                                onChange={handleChange}
                            />
                            <Typography>Start Time: {format(new Date(startTime), "HH:mm a")} </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimeField']}>
                                    <TimeField
                                        fullWidth
                                        value={startTimeEdit}
                                        onChange={(newValue) => setStartTimeEdit(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <Typography>End Time{format(new Date(endTime), "HH:mm a")} </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimeField']}>
                                    <TimeField
                                        fullWidth
                                        value={endTimeEdit}
                                        onChange={(newValue) => setEndTimeEdit(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button onClick={onUpdate} sx={{ backgroundColor: "blue", color: "white" }} fullWidth>Update</Button>
                                <Button onClick={onDelete} sx={{ backgroundColor: "red", color: "white" }} fullWidth>Delete</Button>
                                <Button sx={{ backgroundColor: "orange", color: "white" }} fullWidth><Link href="/performance-tracker">Cancel</Link></Button>
                            </Box>
                        </form>
                    </Box>}
                </>
            )}

        </div>
    );
};

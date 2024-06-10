"use client";
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { ApproveApplication, RejectApplication, deleteApplication, editApplication, getApplicationById } from '@/data/leaveapplications';
import { CircularProgressSpinner } from '../../../../../components/CircularProgress';
import { ToastNotificationError, ToastNotificationSuccess, ToastNotificationWarning } from '../../../../../components/ToastNotification';
import { ErrorOccured } from '../../../../../components/ErrorOccured';
import Link from 'next/link';
import "./../../../globals.css";
import { QueryResultRow } from '@vercel/postgres';
import { LeaveApplicationEdit } from '@/interfaces/leaveapplications';
import { format } from 'date-fns';
import { ChangeEvent } from 'react';
import { Autocomplete, Box, Divider, TextField, Typography } from "@mui/material";


export default function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    const [application, setApplication] = useState<QueryResultRow | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorToastOpen, setErrorToastOpen] = useState(false);
    const [warningToastOpen, setWarningToastOpen] = useState(false);
    const [errorSavingData, setErrorSavingData] = useState("");
    const router = useRouter();

    const { data, isLoading, isError, error } = useQuery(['application', id], () => getApplicationById(id));

    useEffect(() => {
        if (!isLoading) {
            setApplication(data);
        }
    }, [data, isLoading]);

    const handleClick = () => {
        setOpen(false);
        setErrorToastOpen(false);
        setWarningToastOpen(false);
    };

    const onDelete = async () => {
        setIsSaving(true);
        try {
            await deleteApplication(id);
            setWarningToastOpen(true);
            setTimeout(() => {
                router.push("/leave-applications");
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
            const editMyApplication: LeaveApplicationEdit = {
                id: id,
                startdate: application?.startdate,
                enddate: application?.enddate,
                leavetype: application?.leavetype,
                username: application?.username,
                totaldays: application?.totaldays,
                status: application?.status,
                applicationdate: application?.applicationdate
            }

            await editApplication(editMyApplication);
            setOpen(true);
            setTimeout(() => {
                router.push("/leave-applications");
            }, 3000);
        } catch (error) {
            setErrorSavingData((error as Error).message);
            setErrorToastOpen(true);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <CircularProgressSpinner message="Loading Application" />;
    }

    if (isError) {
        console.error('Error loading application:', error); // Log the error
        return <ErrorOccured message={(error as Error).message} />;
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setApplication((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }))
      };
      const handleLeaveTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setApplication((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }))
      }

    return (
        <div className="max-w-md mx-auto mt-8">
            <ToastNotificationSuccess message="Application Updated Successfully" isOpen={open} handleClick={handleClick} duration={6000} />
            <ToastNotificationWarning message="Application Deleted Successfully" isOpen={warningToastOpen} handleClick={handleClick} duration={6000} />
            <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClick} duration={6000} />
            <Box sx={{marginTop:"3vh"}}>
                <Typography sx={{fontWeight:"bold",fontSize:"1.6em",textAlign:"center"}} >Update Application</Typography>
            </Box>            {isSaving && <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
                    <CircularProgressSpinner message='Saving' />
                </div>}
 
                {application && <div>
                    <div className="mb-4">
                        <label htmlFor="applicationdate" className="block mb-1">Date of application:{format(application.applicationdate,"EEEE dd MMMM yyyy")} </label>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="totaldays" className="block mb-1">Total Days Applied For: {application?.totaldays}</label>
            
                    </div>
                    <div className="mb-4">
                        <label htmlFor="startdate" className="block mb-1">Start Date: {format(application.startdate,"EEEE dd MMMM yyyy")} </label>
                        <input
                            type="date"
                            id="startdate"
                            name="startdate"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="enddate" className="block mb-1">End Date: {format(application.enddate,"EEEE dd MMMM yyyy")}</label>
                        <input
                            type="date"
                            id="enddate"
                            name="enddate"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
 
                    <div className="mb-4">
                        <label htmlFor="leaveType" className="block mb-1">Leave Type: {application?.leavetype}</label>
                        <select
                            id="leavetype"
                            name="leavetype"
                            onChange={handleLeaveTypeChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Select Leave Type</option>
                            <option value="Vacation">Vacation</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Personal Leave">Personal Leave</option>
                            <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                        </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }} className='mb-4'>
                        <Button onClick={onUpdate} sx={{ backgroundColor: "blue", color: "white" }} fullWidth>Update</Button>
                        <Button onClick={onDelete} sx={{ backgroundColor: "red", color: "white" }} fullWidth>Delete</Button>
                        <Button sx={{ backgroundColor: "orange", color: "white" }} fullWidth><Link href="/leave-applications">Cancel</Link></Button>
                    </div>
                </div>}
            
        </div>
    );
};

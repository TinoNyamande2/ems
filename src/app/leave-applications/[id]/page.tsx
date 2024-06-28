"use client";
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { ApproveApplication, RejectApplication, getApplicationById } from '@/data/leaveapplications';
import { CircularProgressSpinner } from '../../../../components/misc/CircularProgress';
import { ToastNotificationError, ToastNotificationSuccess, ToastNotificationWarning } from '../../../../components/misc/ToastNotification';
import { ErrorOccured } from '../../../../components/misc/ErrorOccured';
import Link from 'next/link';
import "./../../globals.css";
import { QueryResultRow } from '@vercel/postgres';

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
    }, [data,isLoading,id]);

    const handleClick = () => {
        setOpen(false);
        setErrorToastOpen(false);
        setWarningToastOpen(false);
    };

    const onReject = async () => {
        setIsSaving(true);
        try {
            await RejectApplication(application);
            setWarningToastOpen(true);
            setTimeout(() => {
                router.push("/leave-applications");
            }, 3000);
        } catch (error) {
            console.error('Error rejecting application:', error); // Log the error
            setErrorSavingData((error as Error).message);
            setErrorToastOpen(true);
        } finally {
            setIsSaving(false);
        }
    };

    const onApprove = async () => {
        setIsSaving(true);
        try {
            await ApproveApplication(application);
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
        return <CircularProgressSpinner message="Loading Applications" />;
    }

    if (isError) {
        console.error('Error loading application:', error); // Log the error
        return <ErrorOccured message={(error as Error).message} />;
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <ToastNotificationSuccess message="Application Approved Successfully" isOpen={open} handleClick={handleClick} duration={6000} />
            <ToastNotificationWarning message="Application Rejected Successfully" isOpen={warningToastOpen} handleClick={handleClick} duration={6000} />   
            <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClick} duration={6000} />
            <h1 className="text-2xl font-bold mb-4">Leave Application Form</h1>
            {isSaving ? (
                <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
                    <CircularProgressSpinner message='Saving' />
                </div>
            ) : (
                <div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1">User:</label>
                        <input
                            value={application?.username}
                            readOnly
                            id="username"
                            name="username"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="applicationdate" className="block mb-1">Date of application:</label>
                        <input
                            value={application?.applicationdate}
                            readOnly
                            id="applicationdate"
                            name="applicationdate"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="startdate" className="block mb-1">Start Date:</label>
                        <input
                            value={application?.startdate}
                            readOnly
                            id="startdate"
                            name="startdate"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="enddate" className="block mb-1">End Date:</label>
                        <input
                            value={application?.enddate}
                            readOnly
                            id="enddate"
                            name="enddate"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="totaldays" className="block mb-1">Total Days Applied For:</label>
                        <input
                            value={application?.totaldays}
                            readOnly
                            id="totaldays"
                            name="totaldays"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="leaveType" className="block mb-1">Leave Type:</label>
                        <input
                            value={application?.leavetype}
                            readOnly
                            id="leaveType"
                            name="leavetype"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }} className='mb-4'>
                        <Button onClick={onApprove} sx={{ backgroundColor: "blue", color: "white" }} fullWidth>Approve</Button>
                        <Button onClick={onReject} sx={{ backgroundColor: "red", color: "white" }} fullWidth>Reject</Button>
                        <Button sx={{ backgroundColor: "orange", color: "white" }} fullWidth><Link href="/leave-applications">Cancel</Link></Button>
                    </div>
                </div>
            )}
        </div>
    );
};

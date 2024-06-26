"use client";
import { LeaveApplicationCreate, LeaveApplicationCreateDefaultValues } from '@/interfaces/leaveapplications';
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { CreateLeaveApplicationForm } from '@/data/leaveapplications';
import { CircularProgressSpinner } from '../../../../../components/misc/CircularProgress';
import { ToastNotificationError, ToastNotificationSuccess } from '../../../../../components/misc/ToastNotification';
import { Box, Typography } from '@mui/material';
import "./../../../globals.css"
import { useUserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PageHeader } from '../../../../../components/nav/pageHeader';

export default function LeaveForm() {
    const [formData, setFormData] = useState<LeaveApplicationCreate>(LeaveApplicationCreateDefaultValues);
    const [errors, setErrors] = useState<LeaveApplicationCreate>(LeaveApplicationCreateDefaultValues);
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const [errorToastOpen, setErrorToastOpen] = useState(false);
    const [errorSavingData, setErrorSavingData] = useState("");
    const router = useRouter();
    const { data: session } = useSession();
    const { username, name, role, organisation, organisationid, setName, setOrganisation, setRole, setUsername, setOrganisationId } = useUserContext();


    const handleClick = () => {
        setOpen(false);
        setErrorToastOpen(false);
    };

    // useEffect(() => {
    // }, [organisationid, username]);


    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (!formData.startdate) {
            setErrors((prevErrors) => ({ ...prevErrors, startdate: 'Start Date is required' }));
            return;
        }
        if (!formData.enddate) {
            setErrors((prevErrors) => ({ ...prevErrors, enddate: 'End Date is required' }));
            return;
        }
        if (!formData.leavetype) {
            setErrors((prevErrors) => ({ ...prevErrors, leavetype: 'Leave Type is required' }));
            return;
        }
        if (formData.startdate && formData.enddate) {
            const startDate = new Date(formData.startdate);
            const endDate = new Date(formData.enddate);
            if (startDate >= endDate) {
                setErrors((prevErrors) => ({ ...prevErrors, startdate: 'Start Date must be earlier than End Date' }));
                setErrors((prevErrors) => ({ ...prevErrors, enddate: 'End Date must be later than Start Date' }));
                return
            }
        }
        setIsSaving(true);
        try {
            await CreateLeaveApplicationForm(formData);
            setOpen(true);
            setFormData(LeaveApplicationCreateDefaultValues);
        } catch (error) {
            setErrorSavingData((error as Error).message);
            setErrorToastOpen(true);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((prevInputs) => ({
            ...prevInputs,
            [event.target.name]: event.target.value,
            username: username,
            applicationdate: new Date().toISOString(),
            status: 'NEW',
            organisationid: organisationid,
        }));
        setErrors(LeaveApplicationCreateDefaultValues);
    };

    const handleLeaveTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFormData((prevInputs) => ({
            ...prevInputs,
            leavetype: event.target.value,
        }));
        setErrors(LeaveApplicationCreateDefaultValues);
    };

    return (
        <Box
            id="image"
            sx={{
                mt: { xs: 8, sm: 2 },
                alignSelf: 'center',
                height: "auto",
                width: '100%',
                backgroundSize: 'cover',
                borderRadius: '10px',
                outline: '1px solid',
                padding: { sm: 4, xs: 2 },
                boxShadow: `0 0 12px 8px lightgray`
            }
            }>
            <ToastNotificationSuccess message={"Application Saved Successfully"} isOpen={open} handleClick={handleClick} duration={3000} />
            <ToastNotificationError message={errorSavingData} isOpen={errorToastOpen} handleClick={handleClick} duration={9000} />
            {isSaving ? (
                <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500 z-50">
                    <CircularProgressSpinner message='Saving' />
                </div>
            ) : (
                <Box

                >
                    <Box sx={{paddingBottom:"3vh"}} >
                        <PageHeader message="Apply For Leave" />
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 p-4">
                            <label htmlFor="startdate" className="block mb-1">Start Date:</label>
                            <input
                                type="date"
                                id="startdate"
                                name="startdate"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                            {errors.startdate && <p className="text-red-500 text-sm mt-1">{errors.startdate}</p>}
                        </div>
                        <div className="mb-4 p-4">
                            <label htmlFor="enddate" className="block mb-1">End Date:</label>
                            <input
                                type="date"
                                id="enddate"
                                name="enddate"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                            {errors.enddate && <p className="text-red-500 text-sm mt-1">{errors.enddate}</p>}
                        </div>
                        <div className="mb-4 p-4">
                            <label htmlFor="leaveType" className="block mb-1">Leave Type:</label>
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
                            {errors.leavetype && <p className="text-red-500 text-sm mt-1">{errors.leavetype}</p>}
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
                    </form>
                </Box>

            )}
        </Box>
    );
}

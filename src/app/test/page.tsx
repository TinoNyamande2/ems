"use client"
import { LeaveApplicationCreate, LeaveApplicationCreateDefaultValues } from '@/interfaces/leaveapplications';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import "./../globals.css"

export default function LeaveForm () {
  // State to hold form data and errors
  const [formData, setFormData] = useState<LeaveApplicationCreate>(LeaveApplicationCreateDefaultValues);
  const [errors, setErrors] = useState<LeaveApplicationCreate>(LeaveApplicationCreateDefaultValues);

  // Handle form submission
  const handleSubmit = (event:SyntheticEvent) => {
    event.preventDefault();
    // Validate form data
    const errors = {};
    if (!formData.startdate) {
      setErrors((prevErrors)=>({...prevErrors,['startdate']:'Start Date is required'}))
      return
    }
    if (!formData.enddate) {
      setErrors((prevErrors)=>({...prevErrors,['enddate']:'End Date is required'}))
      return

    }
    if (!formData.leavetype) {
      setErrors((prevErrors)=>({...prevErrors,['leavetype']:'Leave Type is required'}))
      return

    }
 
  };

  // Handle form field changes
  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    setFormData((prevInputs)=>({...prevInputs,[event.target.name]:event.target.value}))
    setErrors(LeaveApplicationCreateDefaultValues);
  };
  const handleLeaveTypeChange = (event:ChangeEvent<HTMLSelectElement>) =>{
    setFormData((prevInputs)=>({...prevInputs,[event.target.name]:event.target.value}))
    setErrors(LeaveApplicationCreateDefaultValues);
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Leave Application Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="startDate" className="block mb-1">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startdate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
          {errors.startdate && <p className="text-red-500 text-sm mt-1">{errors.startdate}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block mb-1">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.enddate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
          {errors.enddate && <p className="text-red-500 text-sm mt-1">{errors.enddate}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="leaveType" className="block mb-1">Leave Type:</label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leavetype}
            onChange={handleLeaveTypeChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Vacation">Vacation</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Personal Leave">Personal Leave</option>
            <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
            {/* Add more leave types as needed */}
          </select>
          {errors.leavetype && <p className="text-red-500 text-sm mt-1">{errors.leavetype}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};


"use server"
import {
  LeaveApplicationCreate,
  LeaveApplicationEdit,
} from "@/interfaces/leaveapplications";
import { sql } from "@vercel/postgres";

const getWeekdaysBetweenDates = (startDate: Date, endDate: Date): number => {
  // Make sure the start date is earlier than the end date
  if (startDate > endDate) {
    throw new Error("Start date must be earlier than end date");
  }

  let count = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};

export const CreateLeaveApplicationForm = async (
  application: LeaveApplicationCreate
) => {
  try {
     const totalDays = getWeekdaysBetweenDates( new Date(application.startdate),new Date(application.enddate))
    await sql`INSERT INTO leaveapplication (applicationdate,username,startdate,enddate,leavetype,totaldays,status)
        VALUES (${application.applicationdate} ,${application.username} , ${application.startdate},
            ${application.enddate},${application.leavetype} , ${totalDays}, ${application.status}
        ) `;
    
        
  } catch (error) {
    throw new Error(error as string);
  }
};
export const ApproveApplication = async (id: string) => {
  try {
    sql`UPDATE leaveapplication SET status = 'APPROVED' WHERE id = ${id}`;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const RejectApplication = async (id: string) => {
  try {
    sql`UPDATE leaveapplication SET status = 'REJECT' WHERE id = ${id}`;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getApplicationById = async (id: string) => {
  try {
    const data =
      await sql`SELECT * FROM leaveapplication WHERE id=${id} LIMIT 1`;
    return data.rows[0];
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getApplicationByUsername = async (username: string|null|undefined) => {
  try {
    if(username) {
      const data =
      await sql`SELECT * FROM leaveapplication WHERE id=${username} `;
      return data.rows;
    } else {
      throw new Error("Username cannot be null")
    }
  
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getAllApplications = async () => {
  try {
    const data = await sql`SELECT * FROM leaveapplication`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getAllNewApplication = async () => {
  try {
    const data = await sql`SELECT * FROM leaveapplication WHERE status='NEW'`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getAllApprovedApplication = async () => {
  try {
    const data =
      await sql`SELECT * FROM leaveapplication WHERE status='APPROVED'`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getAllRejectedApplication = async () => {
  try {
    const data =
      await sql`SELECT * FROM leaveapplication WHERE status='REJECTED'`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const editLeaveApplication = async (
  application: LeaveApplicationEdit
) => {
  try {
    await sql`UPDATE leaveapplication SET startdate=${application.startdate} , enddate=${application.enddate},
       totaldays=${application.totaldays}`;
  } catch (error) {
    throw new Error(error as string);
  }
};

"use server";
import {
  LeaveApplicationCreate,
  LeaveApplicationEdit,
} from "@/interfaces/leaveapplications";
import { QueryResultRow, sql } from "@vercel/postgres";
import { createNotification } from "./notification";
import { NotificationCreate } from "@/interfaces/notification";

const getWeekdaysBetweenDates = (startDate: Date, endDate: Date): number => {
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
    const totalDays = getWeekdaysBetweenDates(
      new Date(application.startdate),
      new Date(application.enddate)
    );
    const data = await sql`INSERT INTO leaveapplication (applicationdate,username,startdate,enddate,leavetype,totaldays,status,organisation)
        VALUES (${application.applicationdate} ,${application.username} , ${application.startdate},
            ${application.enddate},${application.leavetype} , ${totalDays}, ${application.status},${application.organisationid}
        ) RETURNING *`;
         console.log("Data",data.rows)
    const message = `You have a new leave application from ${application.username} `;
    const notification: NotificationCreate = {
      date: application.applicationdate,
      from: application.username,
      to: "tinotenda.nyamande4@gmail.com",
      message: message,
      organisation: data.rows[0].organisation,
      read: false,
      applicationid: data.rows[0].id,
    };
    await createNotification(notification);
  } catch (error) {
    throw new Error(error as string);
  }
};
export const ApproveApplication = async (
  application: QueryResultRow | undefined
) => {
  try {
    sql`UPDATE leaveapplication SET status = 'APPROVED' WHERE id = ${application?.id}`;
    const message = `Your  application for ${application?.leavetype} leave has been approved  `;
    const notification: NotificationCreate = {
      date: new Date().toISOString(),
      to: application?.username,
      from: "tinotenda.nyamande4@gmail.com",
      message: message,
      read: false,
      organisation: application?.organisation,
      applicationid: "",
    };
    await createNotification(notification);
  } catch (error) {
    throw new Error(error as string);
  }
};
export const RejectApplication = async (
  application: QueryResultRow | undefined
) => {
  try {
    sql`UPDATE leaveapplication SET status = 'REJECT' WHERE id = ${application?.id}`;
    const message = `Your  application for  ${application?.leavetype} leave has been rejected  `;
    const notification: NotificationCreate = {
      date: new Date().toISOString(),
      to: application?.username,
      from: "tinotenda.nyamande4@gmail.com",
      message: message,
      read: false,
      applicationid: "",
      organisation: application?.organisation,
    };
    await createNotification(notification);
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getApplicationById = async (id: string) => {
  try {
    const data =
      await sql`SELECT * FROM leaveapplication  WHERE id=${id} LIMIT 1`;
    return data.rows[0];
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getApplicationByUsername = async (
  username: string | null | undefined,
  organisation: string | null | undefined
) => {
  try {
    if (username) {
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE username=${username}  AND organisation=${organisation} `;
      return data.rows;
    } else {
      throw new Error("Username cannot be null");
    }
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getPendingApplicationByUsername = async (
  username: string | null | undefined,
  organisation: string | null | undefined
) => {
  try {
    if (username) {
      const data =
        await sql`SELECT * FROM leaveapplication WHERE username=${username} AND status='NEW' AND organisation=${organisation}`;
      return data.rows;
    } else {
      throw new Error("Username cannot be null");
    }
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getAllApplications = async () => {
  try {
    const data =
      await sql`SELECT * FROM leaveapplication a JOIN users b ON a.username = b.email`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getAllNewApplication = async (
  organisationid: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT a.id ,b.name , a.username , a.startdate , a.enddate , a.totaldays , a.leavetype , a.applicationdate FROM leaveapplication a JOIN users b ON a.username = b.email WHERE status='NEW' AND a.organisation=${organisationid}`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getAllApprovedApplication = async (
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT * FROM leaveapplication a JOIN users b ON a.username = b.email WHERE status='APPROVED' AND organisation=${organisation}`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getAllRejectedApplication = async (
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT * FROM leaveapplication a JOIN users b ON a.username = b.email WHERE status='REJECTED' AND organisation=${organisation}`;
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
export const getLatestApplications = async (
  organisation: string | null | undefined
) => {
  console.log("Organisation",organisation)
  try {
    console.log(organisation)
    const data =
      await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email WHERE TO_DATE(startdate,'YYYY-MM-DD') >CURRENT_DATE AND status='APPROVED' AND a.organisation = ${organisation}   ORDER BY TO_DATE(startdate,'YYYY-MM-DD') LIMIT 10`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getOnLeaveApplications = async (
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email WHERE TO_DATE(startdate,'YYYY-MM-DD') < CURRENT_DATE AND TO_DATE(enddate,'YYYY-MM-DD') > CURRENT_DATE AND status='APPROVED' AND a.organisation = ${organisation} ORDER BY TO_DATE(startdate,'YYYY-MM-DD')`;
    console.log("rows",data.rowCount)
      return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const deleteApplication = async (id: string) => {
  try {
    sql`DELETE FROM leaveapplication WHERE id =${id}`;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const editApplication = async (application: LeaveApplicationEdit) => {
  try {
    const totalDays = getWeekdaysBetweenDates(
      new Date(application.startdate),
      new Date(application.enddate)
    );
    sql`UPDATE leaveapplication SET leavetype=${application.leavetype} ,startdate=${application.startdate}, enddate=${application.enddate},totaldays=${totalDays} WHERE id =${application.id}`;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getLeaveDaysGroupedByUser = async (
  organisation: string | undefined | null
) => {
  try {
    const data =
      await sql`SELECT b.name ,SUM(CAST(a.totaldays AS DOUBLE PRECISION))AS value FROM leaveapplication a JOIN users b ON a.username = b.email WHERE a.organisation = ${organisation}  GROUP BY b.name`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getLeaveDaysGroupedByLeaveType = async (
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT leavetype ,SUM(CAST(totaldays AS DOUBLE PRECISION))AS value FROM leaveapplication WHERE organisation = ${organisation}  GROUP BY leavetype`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getFilteredApplications = async (
  user: string | undefined | null,
  leavetype: string | undefined | null,
  organisation: string | null | undefined
) => {
  try {
    if (user && leavetype) {
      const data =
        await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email WHERE a.leavetype ILIKE ${`%${leavetype}%`} AND b.name ILIKE ${`%${user}%`} AND a.organisation = ${organisation}  `;
      return data.rows;
    } else if (!user && leavetype) {
      const data =
        await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email WHERE a.leavetype ILIKE ${`%${leavetype}%`}  AND a.organisation = ${organisation} `;
      console.log(data.rows);
      return data.rows;
    } else if (user && !leavetype) {
      const data =
        await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email WHERE b.name ILIKE ${`%${user}%`}  AND a.organisation = ${organisation} `;
      return data.rows;
    } else {
      const data =
        await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email AND a.organisation = ${organisation} `;
      return data.rows;
    }
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getFilteredApplicationsForUser = async (
  user: string | undefined | null,
  leavetype: string | undefined | null,
  organisation: string | null | undefined,
  to: string | null,
  from: string | null
) => {
  try {
    if (to && from && leavetype) {
      const convertedStartdate = new Date(from);
      const convertedEnddate = new Date(to);
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE leavetype ILIKE ${`%${leavetype}%`} AND username = ${user} AND organisation = ${organisation} AND applicationdate > ${convertedStartdate.toISOString()} and applicationdate< ${convertedEnddate.toISOString()}`;
      return data.rows;
    } else if (to && from && !leavetype) {
      const convertedStartdate = new Date(from);
      const convertedEnddate = new Date(to);
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE  username = ${user} AND organisation = ${organisation} AND applicationdate > ${convertedStartdate.toISOString()} and applicationdate< ${convertedEnddate.toISOString()}`;
      return data.rows;
    } else if (to && !from && leavetype) {
      const convertedEnddate = new Date(to);
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE leavetype ILIKE ${`%${leavetype}%`} AND username = ${user} AND organisation = ${organisation} AND  applicationdate< ${convertedEnddate.toISOString()}`;
      return data.rows;
    } else if (!to && from && leavetype) {
      const convertedStartdate = new Date(from);
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE leavetype ILIKE ${`%${leavetype}%`} AND username = ${user} AND organisation = ${organisation} AND applicationdate > ${convertedStartdate.toISOString()}`;
      return data.rows;
    } else if (to && !from && !leavetype) {
      const convertedEnddate = new Date(to);
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE username = ${user} AND organisation = ${organisation} AND applicationdate< ${convertedEnddate.toISOString()}`;
      return data.rows;
    } else if (!to && from && !leavetype) {
      const convertedStartdate = new Date(from);
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE username = ${user} AND organisation = ${organisation} AND applicationdate > ${convertedStartdate.toISOString()}`;
      return data.rows;
    } else if (!to && !from && leavetype) {
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE leavetype ILIKE ${`%${leavetype}%`} AND username = ${user} AND organisation = ${organisation}`;
      return data.rows;
    } else {
      const data =
        await sql`SELECT * FROM leaveapplication  WHERE username = ${user} AND organisation = ${organisation}`;
      return data.rows;
    }
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getApplicationsByLeaveTypeForUser = async (
  user: string | null | undefined,
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT leavetype as label,SUM(CAST(totaldays AS DOUBLE PRECISION)) AS value FROM leaveapplication WHERE username=${user} AND organisation=${organisation} AND status='APPROVED' GROUP BY leavetype`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};



export const getFilteredApplicationsForAdmin = async (
  user: string | undefined | null,
  leavetype: string | undefined | null,
  organisation: string | null | undefined,
  groupBy:string|null|undefined
) => {
  
  try {
    if(groupBy === 'User') {
       const data = await sql`SELECT b.email ,b.name as label,SUM(CAST(a.totaldays AS DOUBLE PRECISION)) AS value FROM leaveapplication a JOIN users b ON a.username = b.email GROUP BY b.email , b.name `
       return data.rows
    }  else if(groupBy === 'Leave Type') {
      const data = await sql`SELECT leavetype as label ,SUM(CAST(totaldays AS DOUBLE PRECISION)) AS value FROM leaveapplication GROUP BY leavetype `
      return data.rows
   } else if (!groupBy && user && leavetype) {
      const data =
        await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email  WHERE a.leavetype ILIKE ${`%${leavetype}%`} AND b.name ILIKE ${`%${user}%`} AND a.organisation = ${organisation}`;
      return data.rows;
    } else if (!groupBy && user && !leavetype) {
      const data = await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email  WHERE  b.name ILIKE ${`%${user}%`} AND a.organisation = ${organisation}`;
      return data.rows;
    } else if (!groupBy && !user && leavetype) {
      const data =
      await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email  WHERE a.leavetype ILIKE ${`%${leavetype}%`}  AND a.organisation = ${organisation}`;
      return data.rows;
    } else {
      const data =
      await sql`SELECT a.*,b.name FROM leaveapplication a JOIN users b ON a.username = b.email  WHERE  a.organisation = ${organisation}`;
      return data.rows;
    }
  } catch (error) {
    throw new Error(error as string);
  }
};
export const getApplicationsByLeaveTypeForAdmin = async (
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT leavetype as label,SUM(CAST(totaldays AS DOUBLE PRECISION)) AS value FROM leaveapplication  organisation=${organisation} AND status='APPROVED' GROUP BY leavetype`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getApplicationsByUserForAdmin = async (
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT b.name as label,SUM(CAST(a.totaldays AS DOUBLE PRECISION)) AS value FROM leaveapplication a JOIN users b ON a.username = b.email WHERE  a.organisation=${organisation} AND status='APPROVED' GROUP BY b.name`;
    return data.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};
"use server";
import { PerfomanceCreate, PerfomanceEdit } from "@/interfaces/performance";
import { sql } from "@vercel/postgres";
import {
  subDays,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

export const addPerformance = async (performance: PerfomanceCreate) => {
  try {
    await sql`INSERT INTO performance (starttime,endtime,totalhours,date,project,tags,summary,username,organisation)
    VALUES (${performance.starttime},${performance.endtime},${performance.totalhours},
        ${performance.date},${performance.project} ,${performance.tags},${performance.summary},${performance.username},${performance.organisation}
    )`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceByUsername = async (
  username: string | undefined | null,
  organisation: string | undefined | null
) => {
  try {
    const data = await sql`SELECT * FROM performance a
                             JOIN projects b
                             ON a.project::uuid = b.id
                            JOIN tags c
                             ON a.tags::uuid= c.id
                            WHERE username=${username} AND a.organisation =${organisation}`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceForDayByUsername = async (
  username: string | null | undefined,
  date: string,
  organisation: string | undefined | null
) => {
  try {
    const converteddate = new Date(date);
    const data = await sql`SELECT a.*,b.projectname,c.tagname FROM performance a
                             JOIN projects b
                             ON a.project::uuid = b.id
                            JOIN tags c
                             ON a.tags::uuid= c.id
                            WHERE username=${username} AND date=${converteddate.toISOString()} AND a.organisation =${organisation} ORDER BY a.starttime`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceById = async (id: string) => {
  try {
    const data = await sql`SELECT a.*,b.projectname,c.tagname FROM performance a
                             JOIN projects b
                             ON a.project::uuid = b.id
                            JOIN tags c
                             ON a.tags::uuid= c.id WHERE a.id=${id}`;
    return data.rows[0];
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deletePerformance = async (id: string) => {
  try {
    await sql`DELETE FROM performance WHERE id=${id}`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const editPerformance = async (performance: PerfomanceEdit) => {
  try {
    await sql`UPDATE performance SET starttime=${performance.starttime},
endtime=${performance.endtime} ,
summary=${performance.summary} ,
project=${performance.project} ,
totalhours=${performance.totalhours},
tags=${performance.tags} WHERE id =${performance.id} `;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getAllPerformanceFromPeriod = async (
  startDate: string,
  endDate: string,
  organisation: string | null | undefined
) => {
  try {
    const convertedStartdate = new Date(startDate);
    const convertedEnddate = new Date(endDate);
    const data = await sql`SELECT * FROM performance a
                         JOIN projects b
                         ON a.project::uuid = b.id
                        JOIN tags c
                         ON a.tags::uuid= c.id
                        WHERE a.date >${convertedStartdate.toISOString()} AND a.date<${convertedEnddate.toISOString()} AND organisation=${organisation}`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getHoursPerProject = async (
  startDate: string,
  endDate: string,
  groupBy: string,
  organisation: string | null | undefined
) => {
  try {
    const convertedStartdate = new Date(startDate);
    const convertedEnddate = new Date(endDate);
    if (groupBy == "User") {
      const data = await sql`
      SELECT b.name as label, SUM(CAST(totalhours AS DOUBLE PRECISION))AS value, b.id
      FROM performance a
      JOIN users b ON a.username = b.email
      WHERE a.date > ${convertedStartdate.toISOString()} AND a.date < ${convertedEnddate.toISOString()} AND a.organisation =${organisation}
      GROUP BY a.username, b.id;
    `;
      return data.rows;
    } else {
      const data = await sql`
      SELECT b.projectname as label, SUM(CAST(totalhours AS DOUBLE PRECISION))AS value, b.id
      FROM performance a
      JOIN projects b ON a.project::uuid = b.id
      WHERE a.date > ${convertedStartdate.toISOString()} AND a.date < ${convertedEnddate.toISOString()} AND a.organisation =${organisation}
      GROUP BY b.projectname, b.id;
    `;
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getHoursPerProjectTable = async (
  startDate: string,
  endDate: string,
  organisation: string | null | undefined
) => {
  try {
    const convertedStartdate = new Date(startDate);
    const convertedEnddate = new Date(endDate);
    const data = await sql`
      SELECT b.projectname as label, SUM(CAST(totalhours AS DOUBLE PRECISION)) AS value 
      FROM performance a
      JOIN projects b ON a.project::uuid = b.id
      WHERE a.date > ${convertedStartdate.toISOString()} AND a.date < ${convertedEnddate.toISOString()} AND a.organisation =${organisation}
      GROUP BY b.projectname ;
    `;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceByProjectName = async (
  projectname: string,
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT c.tagname as label,SUM(CAST(a.totalhours AS DOUBLE PRECISION)) AS value
   FROM performance a 
   JOIN projects b ON a.project::uuid = b.id 
   JOIN tags c ON a.tags::uuid=c.id 
   WHERE b.projectname = ${projectname} AND a.organisation =${organisation}
   GROUP BY c.tagname`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceByUserName = async (
  username: string | null | undefined,
  organisation: string | null | undefined
) => {
  try {
    const data = await sql`SELECT 
        b.projectname as label,SUM(CAST(a.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        performance a
JOIN projects b ON a.project::uuid = b.id
      WHERE 
        a.username = ${username} AND a.organisation =${organisation}
GROUP BY b.projectname`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getPerformanceForProjectGroupByUserName = async (
  projectname: string,
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT c.email as label,SUM(CAST(a.totalhours AS DOUBLE PRECISION)) AS value
    FROM performance a 
    JOIN projects b ON a.project::uuid = b.id 
    JOIN users c ON a.username=c.email 
    WHERE b.projectname = ${projectname} AND a.organisation =${organisation}
    GROUP BY c.email`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getPerformanceSummaryForUser = async (
  username: string | null | undefined,
  organisation: string | null | undefined
) => {
  try {
    const data = await sql`SELECT 
        c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
JOIN projects c ON b.project::uuid = c.id
      WHERE 
        a.email = ${username}  AND b.organisation=${organisation}
GROUP BY c.projectname`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getFilteredPerformanceSummaryForAdmin = async (
  organisation: string | null | undefined,
  groupBy: string | null | undefined,
  timePeriod: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  try {
    const currentDate = new Date();
    let startDateFilter: string | null = null;
    let endDateFilter: string | null = null;

    if (timePeriod === "This Week") {
      startDateFilter = startOfWeek(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Week") {
      startDateFilter = subDays(startOfWeek(currentDate), 7).toISOString();
      endDateFilter = subDays(startOfWeek(currentDate), 1).toISOString();
    } else if (timePeriod === "This Month") {
      startDateFilter = startOfMonth(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = startOfMonth(
        subDays(startOfMonth(currentDate), 1)
      );
      startDateFilter = startOfLastMonth.toISOString();
      endDateFilter = endOfMonth(startOfLastMonth).toISOString();
    } else if (timePeriod === "This Year") {
      startDateFilter = startOfYear(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Year") {
      const startOfLastYear = startOfYear(subDays(startOfYear(currentDate), 1));
      startDateFilter = startOfLastYear.toISOString();
      endDateFilter = endOfYear(startOfLastYear).toISOString();
    } else if (!timePeriod && startDate && endDate) {
      startDateFilter = new Date(startDate).toISOString();
      endDateFilter = new Date(endDate).toISOString();
    } else if (!timePeriod && startDate && !endDate) {
      startDateFilter = new Date(startDate).toISOString();
    } else if (!timePeriod && !startDate && endDate) {
      endDateFilter = new Date(endDate).toISOString();
    }
    if (
      (!groupBy || groupBy === "User") && !startDateFilter && !endDateFilter)
    {
      const data = await sql`
      SELECT 
        a.email,a.name as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
         b.organisation = ${organisation} GROUP BY a.email , a.name`;
      return data.rows;
    } else if (groupBy === "User" && startDateFilter && !endDateFilter) {
      const data = await sql`
      SELECT 
        a.email,a.name as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE  b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} GROUP BY a.email, a.name`;
      return data.rows;
    } else if ((!groupBy || groupBy === "User") && !startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        a.email,a.name as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
         b.organisation = ${organisation}
    AND  b.date <= ${endDateFilter} GROUP BY a.email, a.name`;
      return data.rows;
    } else if ((!groupBy ||groupBy === "User") && startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        a.email,a.name as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
       b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY a.email, a.name`;
      return data.rows;
    }
    //project
    else if (
      (groupBy === "Project" && !startDateFilter && !endDateFilter)
    ) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
         b.organisation = ${organisation} GROUP BY c.projectname`;
      return data.rows;
    } else if (groupBy === "Project" && startDateFilter && !endDateFilter) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE  b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (groupBy === "Project" && !startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
         b.organisation = ${organisation}
    AND  b.date <= ${endDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (groupBy === "Project" && startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
       b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (
      groupBy === "Project Tags" &&
      !startDateFilter &&
      !endDateFilter
    ) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
        b.organisation = ${organisation} GROUP BY c.tagname`;
      return data.rows;
    } else if (
      groupBy === "Project Tags" &&
      startDateFilter &&
      !endDateFilter
    ) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
         b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} GROUP BY c.tagname`;
      return data.rows;
    } else if (
      groupBy === "Project Tags" &&
      !startDateFilter &&
      endDateFilter
    ) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
         b.organisation = ${organisation}
    AND b.date <= ${endDateFilter} GROUP BY c.tagname`;
      return data.rows;
    }
    if (groupBy === "Project Tags" && startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
         b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.tagname`;
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getPerformanceSummaryForUserPerProjectForAdmin = async (
  organisation: string | null | undefined,
  projectname: string,
  timePeriod: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  try {
    const currentDate = new Date();
    let startDateFilter: string | null = null;
    let endDateFilter: string | null = null;

    if (timePeriod === "This Week") {
      startDateFilter = startOfWeek(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Week") {
      startDateFilter = subDays(startOfWeek(currentDate), 7).toISOString();
      endDateFilter = subDays(startOfWeek(currentDate), 1).toISOString();
    } else if (timePeriod === "This Month") {
      startDateFilter = startOfMonth(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = startOfMonth(
        subDays(startOfMonth(currentDate), 1)
      );
      startDateFilter = startOfLastMonth.toISOString();
      endDateFilter = endOfMonth(startOfLastMonth).toISOString();
    } else if (timePeriod === "This Year") {
      startDateFilter = startOfYear(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Year") {
      const startOfLastYear = startOfYear(subDays(startOfYear(currentDate), 1));
      startDateFilter = startOfLastYear.toISOString();
      endDateFilter = endOfYear(startOfLastYear).toISOString();
    } else if (!timePeriod && startDate && endDate) {
      startDateFilter = new Date(startDate).toISOString();
      endDateFilter = new Date(endDate).toISOString();
    } else if (!timePeriod && startDate && !endDate) {
      startDateFilter = new Date(startDate).toISOString();
    } else if (!timePeriod && !startDate && endDate) {
      endDateFilter = new Date(endDate).toISOString();
    }

    if (!startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE b.organisation=${organisation} AND d.projectname=${projectname} 
      GROUP BY c.tagname`;
      return data.rows;
    } else if (startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE  b.organisation=${organisation} AND d.projectname=${projectname} AND
      b.date >= ${startDateFilter}  GROUP BY c.tagname
      GROUP BY c.projectname`;
      return data.rows;
    } else if (!startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE  b.organisation=${organisation} AND d.projectname=${projectname} AND
       b.date <= ${endDateFilter} GROUP BY c.tagname`;
      return data.rows;
    } else if (startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE  b.organisation=${organisation} AND d.projectname=${projectname} AND
      b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.tagname`;
      console.log("This week", startDateFilter + " + " + endDateFilter);
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceSummaryForUserPerProjecttagForAdmin = async (
  organisation: string | null | undefined,
  tagname: string,
  timePeriod: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  try {
    const currentDate = new Date();
    let startDateFilter: string | null = null;
    let endDateFilter: string | null = null;

    if (timePeriod === "This Week") {
      startDateFilter = startOfWeek(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Week") {
      startDateFilter = subDays(startOfWeek(currentDate), 7).toISOString();
      endDateFilter = subDays(startOfWeek(currentDate), 1).toISOString();
    } else if (timePeriod === "This Month") {
      startDateFilter = startOfMonth(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = startOfMonth(
        subDays(startOfMonth(currentDate), 1)
      );
      startDateFilter = startOfLastMonth.toISOString();
      endDateFilter = endOfMonth(startOfLastMonth).toISOString();
    } else if (timePeriod === "This Year") {
      startDateFilter = startOfYear(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Year") {
      const startOfLastYear = startOfYear(subDays(startOfYear(currentDate), 1));
      startDateFilter = startOfLastYear.toISOString();
      endDateFilter = endOfYear(startOfLastYear).toISOString();
    } else if (!timePeriod && startDate && endDate) {
      startDateFilter = new Date(startDate).toISOString();
      endDateFilter = new Date(endDate).toISOString();
    } else if (!timePeriod && startDate && !endDate) {
      startDateFilter = new Date(startDate).toISOString();
    } else if (!timePeriod && !startDate && endDate) {
      endDateFilter = new Date(endDate).toISOString();
    }
    console.log("Time", timePeriod);
    console.log(startDateFilter);
    console.log(endDateFilter);

    if (!startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND d.tagname=${tagname} 
      GROUP BY c.projectname`;
      return data.rows;
    } else if (startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND d.tagname=${tagname} AND
      b.date >= ${startDateFilter}  GROUP BY c.projectname`;
      return data.rows;
    } else if (!startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND d.tagname=${tagname} AND
       b.date <= ${endDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND d.tagname=${tagname} AND
      b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.projectname`;
      console.log("This week", startDateFilter + " + " + endDateFilter);
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceSummaryPerUserForAdmin = async (
  organisation: string | null | undefined,
  username: string,
  timePeriod: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  try {
    const currentDate = new Date();
    let startDateFilter: string | null = null;
    let endDateFilter: string | null = null;

    if (timePeriod === "This Week") {
      startDateFilter = startOfWeek(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Week") {
      startDateFilter = subDays(startOfWeek(currentDate), 7).toISOString();
      endDateFilter = subDays(startOfWeek(currentDate), 1).toISOString();
    } else if (timePeriod === "This Month") {
      startDateFilter = startOfMonth(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = startOfMonth(
        subDays(startOfMonth(currentDate), 1)
      );
      startDateFilter = startOfLastMonth.toISOString();
      endDateFilter = endOfMonth(startOfLastMonth).toISOString();
    } else if (timePeriod === "This Year") {
      startDateFilter = startOfYear(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Year") {
      const startOfLastYear = startOfYear(subDays(startOfYear(currentDate), 1));
      startDateFilter = startOfLastYear.toISOString();
      endDateFilter = endOfYear(startOfLastYear).toISOString();
    } else if (!timePeriod && startDate && endDate) {
      startDateFilter = new Date(startDate).toISOString();
      endDateFilter = new Date(endDate).toISOString();
    } else if (!timePeriod && startDate && !endDate) {
      startDateFilter = new Date(startDate).toISOString();
    } else if (!timePeriod && !startDate && endDate) {
      endDateFilter = new Date(endDate).toISOString();
    }
   

    if (!startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label ,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND a.name=${username} 
      GROUP BY c.projectname`;
      return data.rows;
    } else if (startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label ,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND a.name=${username} AND
      b.date >= ${startDateFilter}  GROUP BY c.projectname`;
      return data.rows;
    } else if (!startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND a.name=${username} AND
       b.date <= ${endDateFilter} GROUP BY a.email, a.name`;
      return data.rows;
    } else if (startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE  b.organisation=${organisation} AND a.name=${username} AND
      b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.projectname`;
      console.log("This week", startDateFilter + " + " + endDateFilter);
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getPerformanceSummaryForAdmin = async (
  id: string | null | undefined,
  organisation: string | null | undefined
) => {
  try {
    const data =
      await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value FROM users a JOIN performance b ON a.email = b.username JOIN projects c ON b.project::uuid = c.id WHERE a.name = ${id}  AND b.organisation=${organisation} GROUP BY c.projectname`;

    return data.rows;
  } catch (error) {
    // throw new Error((error as Error).message);
    console.log((error as Error).message);
  }
};

export const getFilteredPerformanceSummaryForUser = async (
  username: string | null | undefined,
  organisation: string | null | undefined,
  groupBy: string | null | undefined,
  timePeriod: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  try {
    const currentDate = new Date();
    let startDateFilter: string | null = null;
    let endDateFilter: string | null = null;

    if (timePeriod === "This Week") {
      startDateFilter = startOfWeek(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Week") {
      startDateFilter = subDays(startOfWeek(currentDate), 7).toISOString();
      endDateFilter = subDays(startOfWeek(currentDate), 1).toISOString();
    } else if (timePeriod === "This Month") {
      startDateFilter = startOfMonth(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = startOfMonth(
        subDays(startOfMonth(currentDate), 1)
      );
      startDateFilter = startOfLastMonth.toISOString();
      endDateFilter = endOfMonth(startOfLastMonth).toISOString();
    } else if (timePeriod === "This Year") {
      startDateFilter = startOfYear(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Year") {
      const startOfLastYear = startOfYear(subDays(startOfYear(currentDate), 1));
      startDateFilter = startOfLastYear.toISOString();
      endDateFilter = endOfYear(startOfLastYear).toISOString();
    } else if (!timePeriod && startDate && endDate) {
      startDateFilter = new Date(startDate).toISOString();
      endDateFilter = new Date(endDate).toISOString();
    } else if (!timePeriod && startDate && !endDate) {
      startDateFilter = new Date(startDate).toISOString();
    } else if (!timePeriod && !startDate && endDate) {
      endDateFilter = new Date(endDate).toISOString();
    }

    if (
      !groupBy ||
      (groupBy === "Project" && !startDateFilter && !endDateFilter)
    ) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation} GROUP BY c.projectname`;
      return data.rows;
    } else if (groupBy === "Project" && startDateFilter && !endDateFilter) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (groupBy === "Project" && !startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation}
    AND  b.date <= ${endDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (groupBy === "Project" && startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        c.projectname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (
      groupBy === "Project Tags" &&
      !startDateFilter &&
      !endDateFilter
    ) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation} GROUP BY c.tagname`;
      return data.rows;
    } else if (
      groupBy === "Project Tags" &&
      startDateFilter &&
      !endDateFilter
    ) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} GROUP BY c.tagname`;
      return data.rows;
    } else if (
      groupBy === "Project Tags" &&
      !startDateFilter &&
      endDateFilter
    ) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation}
    AND b.date <= ${endDateFilter} GROUP BY c.tagname`;
      return data.rows;
    }
    if (groupBy === "Project Tags" && startDateFilter && endDateFilter) {
      const data = await sql`
      SELECT 
        c.tagname as label,
        SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id
      WHERE 
        a.email = ${username} AND b.organisation = ${organisation}
    AND b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.tagname`;
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getPerformanceSummaryForUserPerProject = async (
  username: string | null | undefined,
  organisation: string | null | undefined,
  projectname: string,
  timePeriod: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  try {
    const currentDate = new Date();
    let startDateFilter: string | null = null;
    let endDateFilter: string | null = null;

    if (timePeriod === "This Week") {
      startDateFilter = startOfWeek(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Week") {
      startDateFilter = subDays(startOfWeek(currentDate), 7).toISOString();
      endDateFilter = subDays(startOfWeek(currentDate), 1).toISOString();
    } else if (timePeriod === "This Month") {
      startDateFilter = startOfMonth(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = startOfMonth(
        subDays(startOfMonth(currentDate), 1)
      );
      startDateFilter = startOfLastMonth.toISOString();
      endDateFilter = endOfMonth(startOfLastMonth).toISOString();
    } else if (timePeriod === "This Year") {
      startDateFilter = startOfYear(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Year") {
      const startOfLastYear = startOfYear(subDays(startOfYear(currentDate), 1));
      startDateFilter = startOfLastYear.toISOString();
      endDateFilter = endOfYear(startOfLastYear).toISOString();
    } else if (!timePeriod && startDate && endDate) {
      startDateFilter = new Date(startDate).toISOString();
      endDateFilter = new Date(endDate).toISOString();
    } else if (!timePeriod && startDate && !endDate) {
      startDateFilter = new Date(startDate).toISOString();
    } else if (!timePeriod && !startDate && endDate) {
      endDateFilter = new Date(endDate).toISOString();
    }

    if (!startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.projectname=${projectname} 
      GROUP BY c.tagname`;
      return data.rows;
    } else if (startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.projectname=${projectname} AND
      b.date >= ${startDateFilter}  GROUP BY c.tagname
      GROUP BY c.projectname`;
      return data.rows;
    } else if (!startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.projectname=${projectname} AND
       b.date <= ${endDateFilter} GROUP BY c.tagname`;
      return data.rows;
    } else if (startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.tagname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN tags c ON b.tags::uuid = c.id JOIN projects d ON b.project::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.projectname=${projectname} AND
      b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.tagname`;
      console.log("This week", startDateFilter + " + " + endDateFilter);
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceSummaryForUserPerProjecttag = async (
  username: string | null | undefined,
  organisation: string | null | undefined,
  tagname: string,
  timePeriod: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) => {
  try {
    const currentDate = new Date();
    let startDateFilter: string | null = null;
    let endDateFilter: string | null = null;

    if (timePeriod === "This Week") {
      startDateFilter = startOfWeek(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Week") {
      startDateFilter = subDays(startOfWeek(currentDate), 7).toISOString();
      endDateFilter = subDays(startOfWeek(currentDate), 1).toISOString();
    } else if (timePeriod === "This Month") {
      startDateFilter = startOfMonth(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = startOfMonth(
        subDays(startOfMonth(currentDate), 1)
      );
      startDateFilter = startOfLastMonth.toISOString();
      endDateFilter = endOfMonth(startOfLastMonth).toISOString();
    } else if (timePeriod === "This Year") {
      startDateFilter = startOfYear(currentDate).toISOString();
      endDateFilter = currentDate.toISOString();
    } else if (timePeriod === "Last Year") {
      const startOfLastYear = startOfYear(subDays(startOfYear(currentDate), 1));
      startDateFilter = startOfLastYear.toISOString();
      endDateFilter = endOfYear(startOfLastYear).toISOString();
    } else if (!timePeriod && startDate && endDate) {
      startDateFilter = new Date(startDate).toISOString();
      endDateFilter = new Date(endDate).toISOString();
    } else if (!timePeriod && startDate && !endDate) {
      startDateFilter = new Date(startDate).toISOString();
    } else if (!timePeriod && !startDate && endDate) {
      endDateFilter = new Date(endDate).toISOString();
    }
    console.log("Time", timePeriod);
    console.log(startDateFilter);
    console.log(endDateFilter);

    if (!startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.tagname=${tagname} 
      GROUP BY c.projectname`;
      return data.rows;
    } else if (startDateFilter && !endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.tagname=${tagname} AND
      b.date >= ${startDateFilter}  GROUP BY c.projectname`;
      return data.rows;
    } else if (!startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.tagname=${tagname} AND
       b.date <= ${endDateFilter} GROUP BY c.projectname`;
      return data.rows;
    } else if (startDateFilter && endDateFilter) {
      const data =
        await sql`SELECT c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM users a JOIN performance b ON a.email = b.username
      JOIN projects c ON b.project::uuid = c.id JOIN tags d ON b.tags::uuid = d.id
      WHERE a.email = ${username}  AND b.organisation=${organisation} AND d.tagname=${tagname} AND
      b.date >= ${startDateFilter} AND b.date <= ${endDateFilter} GROUP BY c.projectname`;
      console.log("This week", startDateFilter + " + " + endDateFilter);
      return data.rows;
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

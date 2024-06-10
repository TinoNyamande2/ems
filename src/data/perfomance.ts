"use server";
import { PerfomanceCreate, PerfomanceEdit } from "@/interfaces/performance";
import { sql } from "@vercel/postgres";

export const addPerformance = async (performance: PerfomanceCreate) => {
  try {
    await sql`INSERT INTO performance (starttime,endtime,totalhours,date,project,tags,summary,username)
    VALUES (${performance.starttime},${performance.endtime},${performance.totalhours},
        ${performance.date},${performance.project} ,${performance.tags},${performance.summary},${performance.username}
    )`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceByUsername = async (
  username: string | undefined | null
) => {
  try {
    const data = await sql`SELECT * FROM performance a
                             JOIN projects b
                             ON a.project::uuid = b.id
                            JOIN tags c
                             ON a.tags::uuid= c.id
                            WHERE username=${username} `;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceForDayByUsername = async (
  username: string | null | undefined,
  date: string
) => {
  try {
    const converteddate = new Date(date);
    const data = await sql`SELECT a.*,b.projectname,c.tagname FROM performance a
                             JOIN projects b
                             ON a.project::uuid = b.id
                            JOIN tags c
                             ON a.tags::uuid= c.id
                            WHERE username=${username} AND date=${converteddate.toISOString()}`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceById = async(id: string) => {
      try {
        const data = await sql`SELECT a.*,b.projectname,c.tagname FROM performance a
                             JOIN projects b
                             ON a.project::uuid = b.id
                            JOIN tags c
                             ON a.tags::uuid= c.id WHERE a.id=${id}`
        return data.rows[0]
      }catch (error) {
        throw new Error((error as Error).message);
      }
};

export const deletePerformance = async(id: string) => {
  try {
    await sql`DELETE FROM performance WHERE id=${id}`
  }catch (error) {
    throw new Error((error as Error).message);
  }
};
export const editPerformance = async(performance:PerfomanceEdit) => {
  try {
await sql`UPDATE performance SET starttime=${performance.starttime},
endtime=${performance.endtime} ,
summary=${performance.summary} ,
project=${performance.project} ,
totalhours=${performance.totalhours},
tags=${performance.tags} WHERE id =${performance.id} `
  }catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getAllPerformanceFromPeriod = async (
  startDate: string,
  endDate: string
) => {
  try {
    const convertedStartdate = new Date(startDate);
    const convertedEnddate = new Date(endDate);
    const data = await sql`SELECT * FROM performance a
                         JOIN projects b
                         ON a.project::uuid = b.id
                        JOIN tags c
                         ON a.tags::uuid= c.id
                        WHERE a.date >${convertedStartdate.toISOString()} AND a.date<${convertedEnddate.toISOString()}`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getHoursPerProject = async (
  startDate: string,
  endDate: string,
  groupBy: string
) => {
  try {
    const convertedStartdate = new Date(startDate);
    const convertedEnddate = new Date(endDate);
    if (groupBy == "User") {
      const data = await sql`
      SELECT b.name as label, SUM(CAST(totalhours AS DOUBLE PRECISION))AS value, b.id
      FROM performance a
      JOIN users b ON a.username = b.email
      WHERE a.date > ${convertedStartdate.toISOString()} AND a.date < ${convertedEnddate.toISOString()}
      GROUP BY a.username, b.id;
    `;
      return data.rows;
    } else {
      const data = await sql`
      SELECT b.projectname as label, SUM(CAST(totalhours AS DOUBLE PRECISION))AS value, b.id
      FROM performance a
      JOIN projects b ON a.project::uuid = b.id
      WHERE a.date > ${convertedStartdate.toISOString()} AND a.date < ${convertedEnddate.toISOString()}
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
  endDate: string
) => {
  try {
    const convertedStartdate = new Date(startDate);
    const convertedEnddate = new Date(endDate);
    const data = await sql`
      SELECT b.projectname as label, SUM(CAST(totalhours AS DOUBLE PRECISION)) AS value 
      FROM performance a
      JOIN projects b ON a.project::uuid = b.id
      WHERE a.date > ${convertedStartdate.toISOString()} AND a.date < ${convertedEnddate.toISOString()}
      GROUP BY b.projectname ;
    `;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceByProjectName = async (projectname: string) => {
  try {
    const data =
      await sql`SELECT c.tagname as label,SUM(CAST(a.totalhours AS DOUBLE PRECISION)) AS value
   FROM performance a 
   JOIN projects b ON a.project::uuid = b.id 
   JOIN tags c ON a.tags::uuid=c.id 
   WHERE b.projectname = ${projectname}
   GROUP BY c.tagname`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceByUserName = async (username: string) => {
  try {
    const data = await sql`    SELECT 
        c.projectname as label,SUM(CAST(b.totalhours AS DOUBLE PRECISION)) AS value
      FROM 
        users a
      JOIN 
        performance b ON a.email = b.username
JOIN projects c ON b.project::uuid = c.id
      WHERE 
        a.name = ${username}
GROUP BY c.projectname`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getPerformanceForProjectGroupByUserName = async (
  projectname: string
) => {
  try {
    const data =
      await sql`SELECT c.email as label,SUM(CAST(a.totalhours AS DOUBLE PRECISION)) AS value
    FROM performance a 
    JOIN projects b ON a.project::uuid = b.id 
    JOIN users c ON a.username=c.email 
    WHERE b.projectname = ${projectname}
    GROUP BY c.email`;
    return data.rows;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

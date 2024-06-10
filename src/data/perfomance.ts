"use server";
import { PerfomanceCreate } from "@/interfaces/performance";
import { sql } from "@vercel/postgres";

export const addPerformance = async (performance: PerfomanceCreate) => {
  try {
    console.log("Saving");
    await sql`INSERT INTO performance (starttime,endtime,totalhours,date,project,tags,summary,username)
    VALUES (${performance.starttime},${performance.endtime},${performance.totalhours},
        ${performance.date},${performance.project} ,${performance.tags},${performance.summary},${performance.username}
    )`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export const getPerformanceByUsername = async(username: string|undefined|null) => {
  
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
    const data = await sql`SELECT * FROM performance a
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
export const getPerformanceById = (id: string) => {};
export const editPerformance = (id: string) => {};

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

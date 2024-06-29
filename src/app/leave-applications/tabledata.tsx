"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { QueryResultRow } from '@vercel/postgres';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from "date-fns"
import { getAllNewApplication, getFilteredApplications, getFilteredApplicationsForUser, getLeaveDaysGroupedByLeaveType, getLeaveDaysGroupedByUser, getPendingApplicationByUsername } from '@/data/leaveapplications';
import { useQuery } from 'react-query';
import { NoDataFound } from '../../../components/misc/NoDataFound';
import { CircularProgressSpinner } from '../../../components/misc/CircularProgress';
import { ErrorOccured } from '../../../components/misc/ErrorOccured';
import { useUserContext } from '@/context/userContext';



const LeaveTable = ({ applications }: { applications: QueryResultRow[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Total Days</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>Application Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications?.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.totaldays}</TableCell>
              <TableCell>{leave.leavetype}</TableCell>
              <TableCell>{format(leave.applicationdate, "EEEE dd MMMM yyyy")}</TableCell>
              <Link href={`/leave-applications/${leave.id}`}><Button >View</Button></Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const LeaveTableDetails = ({ username, organisationid, leavetype, to, from }: { username: string | undefined | null, organisationid: string | undefined | null, leavetype: string, to: string, from: string }) => {
  const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
  const getApplications = () => getFilteredApplicationsForUser(username, leavetype, organisationid, to, from)

  const { data, isError, isLoading, error } = useQuery(
    [username, organisationid, leavetype, from, to, 'leave-applications'],
    getApplications,
    {
      enabled: !!username,
    }
  );

  useEffect(() => {
    console.log(username)
    console.log(organisationid)
    console
    if (!isLoading && data) {
      setApplications(data);
      console.log(data)
    }
  }, [username, organisationid, data, isLoading, from, to, leavetype])
  return (
    <>
      {applications && applications.length > 0 ? (<TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Days</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Application Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications?.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{format(leave.startdate, "EEEE dd MMMM yyyy")}</TableCell>
                <TableCell>{format(leave.enddate, "EEEE dd MMMM yyyy")}</TableCell>
                <TableCell>{leave.totaldays}</TableCell>
                <TableCell>{leave.leavetype}</TableCell>
                <TableCell>{leave.status}</TableCell>
                <TableCell>{format(leave.applicationdate, "EEEE dd MMMM yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>) : (
        <NoDataFound message='No applications found' />
      )}
    </>

  );
};
export const PendingLeaveTableDetails = () => {
  const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
  const { username, name, role, organisation, organisationid, setName, setOrganisation, setRole, setUsername, setOrganisationId } = useUserContext();
  const getApplications = () => getPendingApplicationByUsername(username, organisationid)

  const { data, isError, isLoading, error } = useQuery(
    [username, 'pending-leave-applications'],
    getApplications,
    {
      enabled: !!username,
    }
  );
  useEffect(() => {
    console.log(username);
    console.log(organisationid)
    if (!isLoading && data) {
      setApplications(data);
    }
  }, [username, organisationid, isLoading, data])
  if (isLoading) {
    return <CircularProgressSpinner message="Loading Applications" />
  }
  if (isError) {
    return (
      <ErrorOccured message={(error as Error).message} />
    )
  }
  const router = useRouter();

  const handleRedirect = (url: string) => {
    router.push(url);
  };
  return (
    <>{applications && applications?.length > 0 ? (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>Total Days</TableCell>
              <TableCell>Action</TableCell>

            </TableRow >
          </TableHead >
          <TableBody>
            {applications?.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{format(leave.startdate, "EEEE dd MMMM yyyy")}</TableCell>
                <TableCell>{leave.totaldays}</TableCell>
                <Link href={`/leave-applications//user/${leave.id}`}><Button size="small" >View</Button></Link>
              </TableRow>
            ))}
          </TableBody>
        </Table >
      </TableContainer >
    )
      : (
        <NoDataFound message={"You dont have any pending leave applicatios"} />


      )}</>


  );
};

export const LeaveTableForDashboard = ({ applications }: { applications: QueryResultRow[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Leave Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{format(leave.startdate, "EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{format(leave.enddate, "EEEE dd MMMM yyyy")} </TableCell>
              <TableCell>{leave.leavetype}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const OnLeaveTableForDashboard = ({ applications }: { applications: QueryResultRow[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell>Return Date</TableCell>
            <TableCell>Leave Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{format(leave.enddate, "EEEE dd MMMM yyyy")} </TableCell>
              <TableCell>{leave.leavetype}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const LeaveTableReport = ({ applications }: { applications: QueryResultRow[] | undefined }) => {
  return (
    <>
      {applications && applications?.length > 0 ? (<TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Days</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Application Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications?.map((leave: any) => (
              <TableRow key={leave.id}>
                <TableCell>{format(leave.applicationdate, "EEEE dd MMMM yyyy")}</TableCell>
                <TableCell>{leave.name}</TableCell>
                <TableCell>{format(leave.startdate, "EEEE dd MMMM yyyy")}</TableCell>
                <TableCell>{format(leave.enddate, "EEEE dd MMMM yyyy")}</TableCell>
                <TableCell>{leave.totaldays}</TableCell>
                <TableCell>{leave.leavetype}</TableCell>
                <TableCell>{leave.status}</TableCell>
                <TableCell>{format(leave.applicationdate, "EEEE dd MMMM yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>) : (
        (<NoDataFound message={"No data found"} />)
      )}
    </>

  );
};
export const LeaveTableReportGrouped = ({ organisation }: { organisation: string | null | undefined }) => {
  const [applications, setApplications] = useState<QueryResultRow | undefined>(undefined)
  const { data, isLoading, error, isError } = useQuery(["report", "users"], () => getLeaveDaysGroupedByUser(organisation))
  useEffect(() => {
    if (!isLoading) {
      setApplications(data)
    }
  }, [data, isLoading])
  if (isLoading) {
    return <CircularProgressSpinner message="Loading Applications" />
  }
  if (isError) {
    return (
      <ErrorOccured message={(error as Error).message} />
    )
  }
  return (
    <>
      {applications && applications?.length > 0 && !isLoading ? (<TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Total Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications?.map((leave: any) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.name}</TableCell>
                <TableCell>{leave.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>) : (
        <NoDataFound message={"No data found"} />
      )}
    </>

  );
};
export const LeaveTableReportGroupedByLeaveType = ({ organisation }: { organisation: string | null | undefined }) => {
  const [applications, setApplications] = useState<QueryResultRow | undefined>(undefined)
  const { data, isLoading, isError, error } = useQuery(["report", "leave type"], () => getLeaveDaysGroupedByLeaveType(organisation))
  useEffect(() => {
    if (!isLoading) {
      setApplications(data)
    }
  }, [data, isLoading])
  if (isLoading) {
    return <CircularProgressSpinner message="Loading Applications" />
  }
  if (isError) {
    return (
      <ErrorOccured message={(error as Error).message} />
    )
  }
  return (
    <>
      {applications && applications?.length > 0 && !isLoading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>Total Days</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications?.map((leave: any) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.leavetype}</TableCell>
                  <TableCell>{leave.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (<NoDataFound message={"No data found"} />
      )}
    </>

  );

};



export default LeaveTable;




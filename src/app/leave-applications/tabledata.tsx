import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { QueryResultRow } from '@vercel/postgres';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {format} from "date-fns"
import { getFilteredApplications, getLeaveDaysGroupedByLeaveType, getLeaveDaysGroupedByUser } from '@/data/leaveapplications';
import { useQuery } from 'react-query';



const LeaveTable = ({applications}:{applications:QueryResultRow[]}) => {
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
          {applications.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.totaldays}</TableCell>
              <TableCell>{leave.leavetype}</TableCell>
              <TableCell>{format(leave.applicationdate,"EEEE dd MMMM yyyy")}</TableCell>
              <Link href={`/leave-applications/${leave.id}`}><Button >View</Button></Link>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const LeaveTableDetails = ({applications}:{applications:QueryResultRow[]}) => {
  return (
    <TableContainer component={Paper}>
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
          {applications.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{format(leave.startdate,"EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{format(leave.enddate,"EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{leave.totaldays}</TableCell>
              <TableCell>{leave.leavetype}</TableCell>
              <TableCell>{leave.status}</TableCell>
              <TableCell>{format(leave.applicationdate,"EEEE dd MMMM yyyy")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export const PendingLeaveTableDetails = ({applications}:{applications:QueryResultRow[]}) => {
  const router = useRouter();

  const handleRedirect = (url:string) => {
    router.push(url);
  };
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Total Days</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>Application Date</TableCell>
            <TableCell>Action</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{format(leave.startdate,"EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{format(leave.enddate,"EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{leave.totaldays}</TableCell>
              <TableCell>{leave.leavetype}</TableCell>
              <TableCell>{format(leave.applicationdate,"EEEE dd MMMM yyyy")}</TableCell>
              <Link href={`/leave-applications//user/${leave.id}`}><Button >View</Button></Link>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const LeaveTableForDashboard = ({applications}:{applications:QueryResultRow[]}) => {
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
              <TableCell>{format(leave.startdate,"EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{format(leave.enddate,"EEEE dd MMMM yyyy")} </TableCell>
              <TableCell>{leave.leavetype}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const OnLeaveTableForDashboard = ({applications}:{applications:QueryResultRow[]}) => {
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
              <TableCell>{format(leave.enddate,"EEEE dd MMMM yyyy")} </TableCell>
              <TableCell>{leave.leavetype}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const LeaveTableReport = ({user,leavetype}:{user:string,leavetype:string}) => {
  const [applications,setApplications] = useState<QueryResultRow|undefined>(undefined)
  const {data,isLoading} = useQuery(["report",user,leavetype],()=>getFilteredApplications(user,leavetype))
  useEffect(()=>{
    if(!isLoading) {
          setApplications(data)
    }
  })
  return (
    <TableContainer component={Paper}>
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
          {applications?.map((leave:any) => (
            <TableRow key={leave.id}>
              <TableCell>{format(leave.startdate,"EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{format(leave.enddate,"EEEE dd MMMM yyyy")}</TableCell>
              <TableCell>{leave.totaldays}</TableCell>
              <TableCell>{leave.leavetype}</TableCell>
              <TableCell>{leave.status}</TableCell>
              <TableCell>{format(leave.applicationdate,"EEEE dd MMMM yyyy")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export const LeaveTableReportGrouped = () => {
  const [applications,setApplications] = useState<QueryResultRow|undefined>(undefined)
  const {data,isLoading} = useQuery(["report","users"],()=>getLeaveDaysGroupedByUser())
  useEffect(()=>{
    if(!isLoading) {
          setApplications(data)
    }
  })
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Total Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications?.map((leave:any) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export const LeaveTableReportGroupedByLeaveType = () => {
  const [applications,setApplications] = useState<QueryResultRow|undefined>(undefined)
  const {data,isLoading} = useQuery(["report","leave type"],()=>getLeaveDaysGroupedByLeaveType())
  useEffect(()=>{
    if(!isLoading) {
          setApplications(data)
          console.log(data)
    }
  })
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Total Days</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {applications?.map((leave:any) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
};



export default LeaveTable;




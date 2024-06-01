import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { QueryResultRow } from '@vercel/postgres';



const LeaveTable = ({applications}:{applications:QueryResultRow[]}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
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
              <TableCell>{leave.username}</TableCell>
              <TableCell>{leave.startdate}</TableCell>
              <TableCell>{leave.enddate}</TableCell>
              <TableCell>{leave.totaldays}</TableCell>
              <TableCell>{leave.leavetype}</TableCell>
              <TableCell>{leave.status}</TableCell>
              <TableCell>{leave.applicationdate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaveTable;

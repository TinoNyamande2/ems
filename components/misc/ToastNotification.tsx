"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const ToastNotificationSuccess = ({message,isOpen,handleClick,duration}:{message:string,isOpen:boolean,handleClick:()=>void,duration:number}) => {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    handleClick();
  };

  return (
    <div>
      <Snackbar open={isOpen} autoHideDuration={duration} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%',
            backgroundColor: 'blue', 
            color: 'white'
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export const ToastNotificationWarning = ({message,isOpen,handleClick,duration}:{message:string,isOpen:boolean,handleClick:()=>void,duration:number}) => {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    handleClick();
  };

  return (
    <div>
      <Snackbar open={isOpen} autoHideDuration={duration} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%',
            backgroundColor: 'orange', 
            color: 'white'
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export const ToastNotificationError = ({message,isOpen,handleClick,duration}:{message:string,isOpen:boolean,handleClick:()=>void,duration:number}) => {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    handleClick();
  };

  return (
    <div>
      <Snackbar open={isOpen} autoHideDuration={duration} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ 
            width: '100%',
            backgroundColor: 'red', 
            color: 'white'
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
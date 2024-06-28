import React, { useEffect, useState } from 'react';
import { List, ListItem, Typography, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { format } from 'date-fns';
import { getApplicationByUsername } from '@/data/leaveapplications';
import { QueryResultRow } from '@vercel/postgres';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import { CircularProgressSpinner, SmallCircularProgressSpinner } from './CircularProgress';
import { ErrorOccured } from '../misc/ErrorOccured';
import { deleteNotification, getNotificationsByUsername } from '@/data/notification';
import { NoDataFound } from './NoDataFound';

export const Notifications = ({user,organisation}:{user:string|null|undefined, organisation:string|null|undefined}) => {
    const [notifications, setNotifications] = useState<QueryResultRow[] | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string|null>(null);

    const getApplications = () => getNotificationsByUsername(user,organisation);
    const { data, isError, isLoading, error,refetch } = useQuery(
        [user,organisation, 'notifications'],
        getApplications,
    );

    useEffect(() => {
        console.log("user",user);
        console.log("organisation",organisation)
        if (!isLoading && data) {
            setNotifications(data);
            console.log(data)
        }
    }, [organisation,user, data, isLoading]);

    const handleClickOpen = (id:string) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedId(null);
    };

    const onDelete = async () => {
        if (selectedId) {
          try {
            await deleteNotification(selectedId)
            refetch();
          }  catch(error) {
            console.log(error)
          }
        }
    };

    if (isLoading) {
        return <SmallCircularProgressSpinner message="Loading Notifications" />;
    }

    if (isError) {
        return (
            <ErrorOccured message={(error as Error).message} />
        );
    }

    return (
        <>
            {notifications && notifications.length > 0 ? (
                <List>
                    {notifications.map((message, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                backgroundColor: message.read ? '#e0e0e0' : '#ffffff',
                                margin: '10px 0',
                                borderRadius: '8px',
                                boxShadow: message.read ? 'none' : '0px 3px 6px rgba(0,0,0,0.1)',
                                padding: '16px',
                                cursor: 'pointer',
                                textDecoration: 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Link href={`/leave-applications/${message.applicationid}`} passHref>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: message.read ? 'normal' : 'bold' }}
                                    >
                                        {message.message}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'gray', marginTop: '8px' }}
                                    >
                                        {format(new Date(message.date), 'PPpp')}
                                    </Typography>
                                </Box>
                            </Link>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleClickOpen(message.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <NoDataFound message="You have no notification messages" />
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this notification?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onDelete} color="primary" autoFocus>
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

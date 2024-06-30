import { List, Divider, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlightIcon from '@mui/icons-material/Flight';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ApprovalIcon from '@mui/icons-material/Approval';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useRouter } from 'next/navigation';

export const NavLinks = () => {
    const { data: session } = useSession();
   

    const router = useRouter();

    const handleRedirect = (url: string) => {
        const absoluteUrl = url.startsWith('/') ? url : `/${url}`;
        router.push(absoluteUrl);
    };

    return (
        <List component="nav">
            {session && (
                <>
                    <ListItemButton onClick={() => handleRedirect("/")}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={<Typography style={{ fontWeight: 'bold' }}>Dashboard</Typography>} />
                    </ListItemButton>
                    <Divider sx={{ my: 1 }} />
                    <ListSubheader component="div" inset>
                        <Typography sx={{ fontWeight: "bold" }}>Performance Tracker</Typography>
                    </ListSubheader>
                    <ListItemButton onClick={() => handleRedirect(`/performance-tracker/${session?.user?.name}`)}>
                        <ListItemIcon>
                        <WorkHistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Tracker" />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleRedirect(`/performance-tracker/${session?.user?.name}/summary`)} >
                        <ListItemIcon>
                            <SummarizeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Summary" />
                    </ListItemButton>
                    {session.user?.role === "admin" && (
                        <ListItemButton onClick={() => handleRedirect(`/performance-tracker/${session?.user?.name}/overview`)}>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Overview" />
                        </ListItemButton>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <ListSubheader component="div" inset>
                        <Typography sx={{ fontWeight: "bold" }}>Leave Applications</Typography>
                    </ListSubheader>
                    <ListItemButton onClick={() => handleRedirect(`leave-applications/${session?.user?.name}`)}>
                        <ListItemIcon>
                            <CheckBoxIcon />
                        </ListItemIcon>
                        <ListItemText primary="My Applications" />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleRedirect(`leave-applications/${session?.user?.name}/apply`)}>
                        <ListItemIcon>
                            <AddCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Apply" />
                    </ListItemButton>
                    {session.user?.role === 'admin' && <ListItemButton onClick={() => handleRedirect(`leave-applications/${session?.user?.name}/approve`)}>
                        <ListItemIcon>
                            <ApprovalIcon />
                        </ListItemIcon>
                        <ListItemText primary="Approve Applications" />
                    </ListItemButton>}
                    <ListItemButton onClick={() => handleRedirect(`leave-applications/${session?.user?.name}/pending`)}>
                        <ListItemIcon>
                            <PendingActionsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pending Aplications" />
                    </ListItemButton>
                    {session.user?.role === 'admin' && <ListItemButton onClick={() => handleRedirect(`leave-applications/${session?.user?.name}/reports`)}>
                        <ListItemIcon>
                            <LibraryBooksIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reports" />
                    </ListItemButton>}
                    <Divider sx={{ my: 1 }} />
                    <ListSubheader component="div" inset>
                        Account Info
                    </ListSubheader>
                    <ListItemButton onClick={() => handleRedirect("/profile")}>
                        <ListItemIcon>
                            <ManageAccountsIcon />
                        </ListItemIcon>
                        <ListItemText primary="View Profile" />
                    </ListItemButton>
                    <ListItemButton onClick={() => signOut()}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log out" />
                    </ListItemButton>
                </>
            )}
            {!session && (
                <>
                    <ListItemButton onClick={() => handleRedirect("/login")}>
                        <ListItemIcon>
                            <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log in" />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleRedirect("/signup")}>
                        <ListItemIcon>
                            <PersonAddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign up" />
                    </ListItemButton>
                </>
            )}
        </List>
    );
};

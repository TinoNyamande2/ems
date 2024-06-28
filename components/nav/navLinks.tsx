import { mainListItems, secondaryListItems } from "@/app/defaultcomponents/listItems";
import { List, Divider } from "@mui/material";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment'; 
import { Logout } from "@mui/icons-material";
import {redirect} from 'next/navigation';
import FlightIcon from '@mui/icons-material/Flight';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useRouter } from 'next/navigation';
import { getUserByEmail } from "@/data/user";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { QueryResultRow } from "@vercel/postgres";


export const NavLinks = () => {
    const { data: session } = useSession();
    const useremail = session?.user?.email;
    const [user,setUser] = useState<QueryResultRow|undefined>(undefined);

    
    const router = useRouter();

    const handleRedirect = (url:string) => {
      router.push(url);
    };
    const fetchUser = () => getUserByEmail(useremail);

    const { data, isError, isLoading } = useQuery(
      [useremail],
      fetchUser,
      {
        enabled: !!useremail,
      }
    );
    useEffect(()=>{
        if(!isLoading) {
            setUser(data);
        }
    },[session,isLoading,data])

    return (
        <List component="nav">
            {session && <ListItemButton onClick={()=>handleRedirect("/")}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>}
            {session && <ListItemButton onClick={()=>handleRedirect("/leave-applications")}>
                <ListItemIcon>
                    <FlightIcon />
                </ListItemIcon>
                <ListItemText primary="Leave Applications" />
            </ListItemButton>}
            {session &&
                <ListItemButton onClick={()=>handleRedirect("/performance-tracker")}>
                    <ListItemIcon>
                        <WorkHistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Perfomance Tracker" />
                </ListItemButton>}
            {session && user?.role=="admin" && <ListItemButton onClick={()=>handleRedirect("/settings")} >
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItemButton>}
            {session && <Divider sx={{ my: 1 }} />}
            {session && <ListSubheader component="div" inset>
                Account Info
            </ListSubheader>}
            {session && <ListItemButton onClick={()=>handleRedirect("/profile")} >
                <ListItemIcon>
                    <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="View Profile" />
            </ListItemButton>}
            {session && <ListItemButton onClick={()=>signOut()}>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Log out" />
            </ListItemButton>}
            {!session && <ListItemButton onClick={()=>handleRedirect("/login")} >
                <ListItemIcon>
                    <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Log in" />
            </ListItemButton>}
            {!session && <ListItemButton onClick={()=>handleRedirect("/signup")} >
                <ListItemIcon>
                    <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Sign up" />
            </ListItemButton>}
        </List>
    )

}
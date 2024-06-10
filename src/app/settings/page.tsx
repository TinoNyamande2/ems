"use client"

import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import {redirect} from 'next/navigation'
import { getUserByEmail } from "@/data/user";
import { useQuery } from "react-query";
import { QueryResultRow } from "@vercel/postgres";
import { CircularProgressSpinner } from "../../../components/CircularProgress";
import { Projects } from "./projects";
import { Users } from "./users";
import { Tags } from "./projecttags";


export default function Page () {
    const [projectsSelected, setProjectsSelected] = useState(true);
    const [usersSelected, setUsersSelected] = useState(false);
    const [tagsSelected, setTagsSelected] = useState(false);
    const [user,setUser] = useState<QueryResultRow|undefined>(undefined);
    const handleProjectsSelected = () => {
        setProjectsSelected(true);
        setUsersSelected(false);
        setTagsSelected(false);
    }
    const handleProjectTagsSelected = () => {
        setProjectsSelected(false);
        setUsersSelected(false);
        setTagsSelected(true); 
    }
    const handleUsersSelected = () => {
        setProjectsSelected(false);
        setUsersSelected(true);
        setTagsSelected(false);
    }

    const { data: session } = useSession();
    const useremail = session?.user?.email;
  
    if(!session) {
      redirect("/login")
    }
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
  if(isLoading) {
    return <CircularProgressSpinner message="Loading"/>
  }

    return (
        <Box>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Button size="small" onClick={handleProjectsSelected} fullWidth sx={{
                    ...(projectsSelected && { backgroundColor: "blue", color: "white" }),
                }} >Projects </Button>
                <Button size="small" onClick={handleProjectTagsSelected} fullWidth sx={{
                    ...(tagsSelected && { backgroundColor: "blue", color: "white" }),
                }}>Project tags</Button>
                {user?.role=='admin' && !isLoading && <Button size="small" onClick={handleUsersSelected} fullWidth sx={{
                    ...(usersSelected && { backgroundColor: "blue", color: "white" }),
                }}>Manage Users</Button>}
            </Box>
            <Box>
                {projectsSelected && <Projects/>}
                {tagsSelected && <Tags/>}
                {usersSelected && <Users />}
            </Box>
        </Box>
    )

}
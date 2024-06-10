"use client";
import { getPerformanceByProjectName } from "@/data/perfomance";
import { Box, Typography } from "@mui/material";
import { QueryResultRow } from "@vercel/postgres";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ProjectsTable } from "./user/[id]/table";
import { useSession } from "next-auth/react";

export default function Reports() {
    const { data: session, status } = useSession();
    const id = session?.user?.name;

    if (status === "loading") {
        return <Typography>Loading...</Typography>;
    }

    if (status === "unauthenticated") {
        return <Typography>You need to be authenticated to view this page.</Typography>;
    }

    return (
        <Box>
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >
                    {id}
                </Typography>
            </Box>            
            {status === "authenticated" && id && <ProjectsTable id={id} />}
        </Box>
    );
}

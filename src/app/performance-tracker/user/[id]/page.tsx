"use client"
import { getPerformanceByProjectName } from "@/data/perfomance"
import { Box, Typography } from "@mui/material"
import { QueryResultRow } from "@vercel/postgres"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { ProjectsTable } from "./table"

export default function Page({ params }: { params: { id: string } }) {
    const id = decodeURIComponent(params.id);

    return (
        <Box>
            <Box sx={{ marginTop: "3vh" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.6em", textAlign: "center" }} >{id} </Typography>F
            </Box>            
            <ProjectsTable id={id} />
        </Box>
    )
}
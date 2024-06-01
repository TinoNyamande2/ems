"use client"
import { useEffect, useState } from "react"
import LeaveTable from "./tabledata"
import { QueryResultRow } from "@vercel/postgres"
import { getApplicationByUsername } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";

export default function Applications() {
    const { data: session } = useSession();

    const [applications, setApplications] = useState<QueryResultRow[] | null>(null);
    useEffect(() => {
        const getData = async () => {
            if (session?.user) {
                const data = await getApplicationByUsername(session.user.name);
                setApplications(data);
            }
        }
        getData();
    }, [session])

    return (
        <>
            {applications ? (<LeaveTable applications={applications} />
            ):(<p>No data found</p>)}
        </>
    )
}
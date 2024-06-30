"use client";
import { useEffect, useState } from "react";
import LeaveTable, { LeaveTableDetails } from "./tabledata";
import { QueryResultRow } from "@vercel/postgres";
import { getApplicationByUsername, getFilteredApplicationsForUser } from "@/data/leaveapplications";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { CircularProgressSpinner } from "../../../components/misc/CircularProgress";
import { NoDataFound } from "../../../components/misc/NoDataFound";
import { ErrorOccured } from "../../../components/misc/ErrorOccured";
import { Box, Button, Typography } from "@mui/material";
import UserSearch from "./usersearch";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPieChart } from "./userPieChart";
import Link from "next/link";
import { getUserByEmail } from "@/data/user";
import { useUserContext } from "@/context/userContext";

export default function Applications() {
    const { data: session } = useSession();
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || "";
    const to = searchParams.get("to") || "";
    const leavetype = searchParams.get("leavetype") || "";
    const {username,name,role,organisation,organisationid,setName,setOrganisation,setRole,setUsername,setOrganisationId} = useUserContext();


    return (
        <>
            <Box sx={{ paddingTop: "3vh", width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "5vh" }}>
                {showSearchBar && <UserSearch placeholder="" onClose={() => setShowSearchBar(false)} />}
                <Button
                    onClick={() => setShowSearchBar((prev) => !prev)}
                    size="small"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2, marginTop: 1 }}
                >
                    {showSearchBar ? "Close Search Bar" : "Open Search Bar"}
                </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { sm: "row", xs: "column" }, gap: 2 }}>
                <Link style={{ flex: "1" }} href={`/leave-applications/${name}/apply`}>
                    <Button fullWidth variant="contained">Apply</Button>
                </Link>
                <Link style={{ flex: "1" }} href={`/leave-applications/${name}/pending`}>
                    <Button fullWidth variant="contained">View Pending Applications</Button>
                </Link>
                {role==='admin' && <Link style={{ flex: "1" }} href={`/leave-applications/${name}/approve`}>
                    <Button fullWidth variant="contained">Approve Applications</Button>
                </Link>}
                {role==='admin' && <Link style={{ flex: "1" }} href={`/leave-applications/${name}/reports`}>
                    <Button fullWidth variant="contained">Leave Reports</Button>
                </Link>}
            </Box>
            <Box sx={{ paddingTop: "3vh", width: { sm: "800px", xs: "100%" }, marginLeft: "auto", marginRight: "auto", marginBottom: "5vh" }}>
                {<UserPieChart username={username} organisation={organisationid} />}
            </Box>
            {<LeaveTableDetails username={username} organisationid={organisationid} leavetype={leavetype} to={to} from={from} />}
        </>
    );
}

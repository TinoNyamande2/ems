'use client';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { addWeeks, subWeeks } from "date-fns";


export default function UserSearch({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const { replace } = useRouter();
    const [leavetype, setLeavetype] = useState("");
    function handleSearch() {
        const params = new URLSearchParams(searchParams);
        if (leavetype && startDate && endDate) {
            params.set('from', startDate);
            params.set('leavetype', leavetype);
            params.set('to', endDate);
        } else if (leavetype && startDate && !endDate) {
            params.set('from', startDate);
            params.set('leavetype', leavetype);
            params.delete('to');
        } else if (leavetype && !startDate && endDate) {
            params.set('leavetype', leavetype);
            params.set('to', endDate);
            params.delete('from');
        }
        else if (!leavetype && startDate && endDate) {
            params.set('from', startDate);
            params.delete('leavetype');
            params.set('to', endDate);
        }
        else if (leavetype && !startDate && !endDate) {
            params.delete('from');
            params.set('leavetype', leavetype);
            params.delete('to');
        }
        else if (!leavetype && startDate && !endDate) {
            params.set('from', startDate);
            params.delete('leavetype');
            params.delete('to');
        }
        else if (!leavetype && !startDate && endDate) {
            params.delete('from');
            params.delete('leavetype');
            params.set('to', endDate);
        }
        else if (!leavetype && !startDate && !endDate) {
            params.delete('from');
            params.delete('leavetype');
            params.delete('to');
        }
        replace(`${pathname}?${params.toString()}`);
    }
    const handleClear = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('leavetype');
        params.delete('user');
        params.delete('groupBy');
        replace(`${pathname}?${params.toString()}`);

    }



    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", width: "100%" }}>

            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }}>

  

                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
                    <label htmlFor="from-date">From</label>
                    <TextField
                        id="from-date"
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
                    <label htmlFor="from-date">To </label>
                    <TextField
                        id="from-date"
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
                    <label htmlFor="to-date">Leave Type</label>
                    <TextField
                        id="to-date"
                        onChange={(e) => setLeavetype(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <label>&nbsp;</label>
                    <Button
                        onClick={handleSearch}
                        size="small"
                        variant="outlined"
                        sx={{ flex: "1", backgroundColor: "blue", color: "white" }}
                    >
                        Search
                    </Button>
                </Box>
            </Box>

            <br />

            <Button
                onClick={handleClear}
                size="small"
                variant="outlined"
                sx={{ flex: "1", backgroundColor: "red", color: "white" }}
            >
                Clear Search
            </Button>
        </Box>
    );
}
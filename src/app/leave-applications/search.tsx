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


export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [leavetype, setLeavetype] = useState("");
    const [user, setUser] = useState<string>("")
    //const [to, setTo] = useState<string>(enddate.toISOString());
    const [groupBy, setGroupBy] = useState<string|null>("None");
    const options = ["None","user","leavetype"]
    const handleOptionsChange = (event: ChangeEvent<{}>, value: string | null) => {
        setGroupBy(value)
    }
    function handleSearch() {
        const params = new URLSearchParams(searchParams);
        if (user && leavetype && groupBy) {
            params.set('user', user);
            params.set('leavetype', leavetype);
            params.set('groupBy', groupBy);
        } else if (leavetype && user && !groupBy) {
            params.set('user', user);
            params.set('leavetype', leavetype);
            params.set('groupBy', 'None');
        }else if (leavetype && groupBy && !user) {
            params.set('user', "");
            params.set('leavetype', leavetype);
            params.set('groupBy', groupBy);
        }
        else if (!leavetype && groupBy && user) {
            params.set('user', user);
            params.set('leavetype', "");
            params.set('groupBy', groupBy);
        }
        else if (leavetype && !groupBy && !user) {
          params.set('user',"");
          params.set('leavetype', leavetype);
          params.set('groupBy', 'None');
        }
        else if (!leavetype && groupBy && !user) {
            params.set('user', "");
            params.set('leavetype', "");
            params.set('groupBy', groupBy);
        }
        else if (!leavetype && !groupBy && user) {
            params.set('user',user);
            params.set('leavetype',"");
            params.set('groupBy', 'Project');
        }
        else if (!leavetype && !groupBy && !user) {
            params.set('user', "");
            params.set('leavetype',"" );
            params.set('groupBy', "None");
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
            <label htmlFor="combo-box-demo">Group By</label>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={options}
              size="small"
              fullWidth
              defaultValue="None"
              onChange={handleOptionsChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
  
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
            <label htmlFor="from-date">User </label>
            <TextField
              id="from-date"
              onChange={(e) => setUser(e.target.value)}
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
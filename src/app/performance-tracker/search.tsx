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
    const [enddate, setEnddate] = useState(new Date());
    const defaultStartdate = subWeeks(enddate, 4);
    const [startdate, setStartDate] = useState(defaultStartdate);
    const [from, setFrom] = useState<string>(startdate.toISOString());
    const [to, setTo] = useState<string>(enddate.toISOString());
    const [groupBy, setGroupBy] = useState<string|null>("Project");
    const options = ["Project","User"]
    const handleOptionsChange = (event: ChangeEvent<{}>, value: string | null) => {
        setGroupBy(value)
    }
    function handleSearch() {
        const params = new URLSearchParams(searchParams);
        if (from && to && groupBy) {
            params.set('from', from);
            params.set('to', to);
            params.set('groupBy', groupBy);
        } else if (to && from && !groupBy) {
            params.set('from', from);
            params.set('to', to);
            params.set('groupBy', 'Project');
        }else if (to && groupBy && !from) {
            params.set('from', subWeeks(new Date(to),4).toISOString());
            params.set('to', to);
            params.set('groupBy', groupBy);
        }
        else if (!to && groupBy && from) {
            params.set('from', from);
            params.set('to', addWeeks(new Date(from),4).toISOString());
            params.set('groupBy', groupBy);
        }
        else if (to && !groupBy && !from) {
          params.set('from', subWeeks(new Date(to),4).toISOString());
          params.set('to', to);
          params.set('groupBy', 'Project');
        }
        else if (!to && groupBy && !from) {
            params.set('from', enddate.toISOString());
            params.set('to', startdate.toISOString());
            params.set('groupBy', groupBy);
        }
        else if (!to && !groupBy && from) {
            params.set('from',from);
            params.set('to', addWeeks(new Date(from),4).toISOString());
            params.set('groupBy', 'Project');
        }
        else if (!to && !groupBy && !from) {
            params.set('from', startdate.toISOString());
            params.set('to',enddate.toISOString() );
            params.set('groupBy', 'Project');
        }
        replace(`${pathname}?${params.toString()}`);
    }
    const handleClear = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('to');
        params.delete('from');
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
              defaultValue="Project"
              onChange={handleOptionsChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
  
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
            <label htmlFor="from-date">From </label>
            <TextField
              id="from-date"
              type="date"
              onChange={(e) => setFrom(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>
  
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
            <label htmlFor="to-date">To</label>
            <TextField
              id="to-date"
              type="date"
              onChange={(e) => setTo(e.target.value)}
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
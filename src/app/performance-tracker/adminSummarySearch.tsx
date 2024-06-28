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


export const UserSearchGroupBy=({ placeholder }: { placeholder: string }) =>{
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [groupBy, setGroupBy] = useState<string|null>("Project");
    const options = ["Project","Project Tags"]
    const handleOptionsChange = (event: ChangeEvent<{}>, value: string | null) => {
        setGroupBy(value)
    }
    function handleSearch() {
        const params = new URLSearchParams(searchParams);
        if (groupBy) {
            params.set('groupBy', groupBy);
        }
        else {
            params.set('groupBy', 'Project');
        }
        replace(`${pathname}?${params.toString()}`);
    }
    const handleClear = () => {
        const params = new URLSearchParams(searchParams);
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


export const AdminSummarySearch = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [timePeriod, setTimePeriod] = useState<string | null>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState<string | null>("User");

  const groupByOptions = ["User","Project", "Project Tags"];
  const timePeriodOptions = ["This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year"];

  const handleOptionsChange = (event: ChangeEvent<{}>, value: string | null) => {
    setGroupBy(value);
  };

  const handleTimePeriodChange = (event: ChangeEvent<{}>, value: string | null) => {
    setTimePeriod(value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (groupBy) {
      params.set('groupBy', groupBy);
    }
    if (timePeriod) {
      params.set('timePeriod', timePeriod);
    }
    if (startDate) {
      params.set('startDate', startDate);
    }
    if (endDate) {
      params.set('endDate', endDate);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('groupBy');
    params.delete('timePeriod');
    params.delete('startDate');
    params.delete('endDate');
    replace(`${pathname}?${params.toString()}`);
    setGroupBy("Project");
    setTimePeriod("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", width: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
          <label htmlFor="group-by">Group By</label>
          <Autocomplete
            disablePortal
            id="group-by"
            options={groupByOptions}
            size="small"
            fullWidth
            value={groupBy}
            onChange={handleOptionsChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
          <label htmlFor="time-period">Time Period</label>
          <Autocomplete
            disablePortal
            id="time-period"
            options={timePeriodOptions}
            size="small"
            fullWidth
            value={timePeriod}
            onChange={handleTimePeriodChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
          <label htmlFor="start-date">Start Date</label>
          <TextField
            id="start-date"
            type="date"
            size="small"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", marginRight: 2 }}>
          <label htmlFor="end-date">End Date</label>
          <TextField
            id="end-date"
            type="date"
            size="small"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
};

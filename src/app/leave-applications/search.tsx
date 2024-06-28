'use client';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";


export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [leavetype, setLeavetype] = useState("");
  const [user, setUser] = useState<string>("")

  function handleSearch() {
    const params = new URLSearchParams(searchParams);
    if (user && leavetype) {
      params.set('user', user);
      params.set('leavetype', leavetype);
    } else if (leavetype && !user) {
      params.delete('user');
      params.set('leavetype', leavetype);
    } else if (!leavetype && user) {
      params.set('user', user);
      params.delete('leavetype');
    } else {
      params.delete('user');
      params.delete('leavetype');
    }
    replace(`${pathname}?${params.toString()}`);
  }
  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('leavetype');
    params.delete('user');
    replace(`${pathname}?${params.toString()}`);

  }



  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", width: "100%" }}>

      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
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
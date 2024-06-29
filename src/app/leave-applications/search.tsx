'use client';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [leavetype, setLeavetype] = useState<string>("");
  const [user, setUser] = useState<string>("");

  const handleSearch = () => {
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
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('leavetype');
    params.delete('user');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="user-input">User</label>
            <TextField
              id="user-input"
              onChange={(e) => setUser(e.target.value)}
              size="small"
              fullWidth
              placeholder={placeholder}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="leave-type-input">Leave Type</label>
            <TextField
              id="leave-type-input"
              onChange={(e) => setLeavetype(e.target.value)}
              size="small"
              fullWidth
              placeholder={placeholder}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label>&nbsp;</label>
            <Button
              onClick={handleSearch}
              size="small"
              variant="contained"
              sx={{ flex: "1" }}
            >
              Search
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={handleClear}
            size="small"
            variant="contained"
            color="error"
            sx={{ flex: "1" }}
          >
            Clear Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

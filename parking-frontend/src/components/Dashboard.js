import React from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";

export default function Dashboard({ onNavigate }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: 4 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 400, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Parking Dashboard
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={() => onNavigate("parking")}>
            Parking Management
          </Button>
          <Button variant="contained" onClick={() => onNavigate("slots")}>
            Slot Management
          </Button>
          <Button variant="contained" onClick={() => onNavigate("history")}>
            Transaction History
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onNavigate("logout")}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

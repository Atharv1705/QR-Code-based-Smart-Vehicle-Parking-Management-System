import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function AppBarNav({ title, onMenu }) {
  return (
    <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenu}
        >
          <DirectionsCarIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title || "Vehicle Parking System"}
        </Typography>
        <Box />
      </Toolbar>
    </AppBar>
  );
}

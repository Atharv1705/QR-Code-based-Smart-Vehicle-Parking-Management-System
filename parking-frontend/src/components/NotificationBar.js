import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function NotificationBar({
  open,
  message,
  severity = "info",
  onClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

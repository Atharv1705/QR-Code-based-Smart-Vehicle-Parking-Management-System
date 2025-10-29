import { Snackbar, Alert, Slide } from "@mui/material";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function NotificationBar({
  open,
  message,
  severity = "info",
  onClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={SlideTransition}
      sx={{
        zIndex: (theme) => theme.zIndex.snackbar,
        "& .MuiSnackbarContent-root": {
          minWidth: 300,
        },
      }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        variant="filled"
        sx={{ 
          width: "100%",
          minWidth: 300,
          fontWeight: 500,
          boxShadow: (theme) => theme.shadows[8],
          "& .MuiAlert-icon": {
            fontSize: 20,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

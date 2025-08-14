import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import QRCodeGen from "./QRCodeGen";

export default function ParkingManagement({ user, api, onNotify }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/slots");
      setSlots(res.data.slots || []);
    } catch {
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line
  }, []);

  const handleBook = async (slotId) => {
    try {
      await api.post("/book", { slotId, username: user.username });
      onNotify &&
        onNotify({ open: true, message: "Slot booked!", severity: "success" });
      fetchSlots();
    } catch {
      onNotify &&
        onNotify({ open: true, message: "Booking failed", severity: "error" });
    }
  };

  const handleRelease = async (slotId) => {
    try {
      await api.post("/release", { slotId, username: user.username });
      onNotify &&
        onNotify({
          open: true,
          message: "Slot released!",
          severity: "success",
        });
      fetchSlots();
    } catch {
      onNotify &&
        onNotify({ open: true, message: "Release failed", severity: "error" });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: 4 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Parking Management
        </Typography>
        <QRCodeGen />
        <Typography variant="h6" sx={{ mt: 4 }}>
          Available Slots
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {slots.map((slot) => (
              <ListItem
                key={slot.id}
                secondaryAction={
                  slot.occupied ? (
                    slot.occupiedBy === user.username ? (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleRelease(slot.id)}
                      >
                        Release
                      </Button>
                    ) : (
                      <Button variant="outlined" disabled>
                        Occupied
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleBook(slot.id)}
                    >
                      Book
                    </Button>
                  )
                }
              >
                <ListItemText
                  primary={`Slot #${slot.id}`}
                  secondary={
                    slot.occupied
                      ? `Occupied by ${slot.occupiedBy}`
                      : "Available"
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

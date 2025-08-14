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
  TextField,
  Stack,
} from "@mui/material";

export default function SlotManagement({ user, api, onNotify }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [adding, setAdding] = useState(false);

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

  const handleAddSlot = async () => {
    if (!newSlot) return;
    setAdding(true);
    try {
      await api.post("/slots", { id: newSlot });
      setNewSlot("");
      onNotify &&
        onNotify({ open: true, message: "Slot added!", severity: "success" });
      fetchSlots();
    } catch {
      onNotify &&
        onNotify({ open: true, message: "Add slot failed", severity: "error" });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await api.delete(`/slots/${slotId}`);
      onNotify &&
        onNotify({ open: true, message: "Slot deleted!", severity: "success" });
      fetchSlots();
    } catch {
      onNotify &&
        onNotify({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: 4 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Slot Management
        </Typography>
        <Stack direction="row" spacing={2} sx={{ my: 2 }}>
          <TextField
            label="New Slot ID"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleAddSlot} disabled={adding}>
            Add Slot
          </Button>
        </Stack>
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
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteSlot(slot.id)}
                  >
                    Delete
                  </Button>
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

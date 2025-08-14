import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function UserProfile({ user, api, onSave }) {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/profile", { username, email });
      setEditing(false);
      if (onSave) onSave({ ...user, username, email });
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: 4 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 400, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar
            sx={{ width: 72, height: 72, bgcolor: "#1976d2", fontSize: 36 }}
          >
            {username[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h5">User Profile</Typography>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            disabled={!editing || loading}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={!editing || loading}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {editing ? (
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

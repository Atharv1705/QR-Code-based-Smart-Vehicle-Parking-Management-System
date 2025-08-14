import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

export default function Settings({ user, api, onNotify }) {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/settings?username=${user.username}`);
      setSettings(
        res.data.settings || { notifications: true, darkMode: false }
      );
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.post("/settings", { username: user.username, ...settings });
      onNotify &&
        onNotify({
          open: true,
          message: "Settings saved!",
          severity: "success",
        });
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: 4 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 500, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Settings
        </Typography>
        <Divider sx={{ my: 2 }} />
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={() => handleToggle("notifications")}
                />
              }
              label="Enable Notifications"
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={() => handleToggle("darkMode")}
                />
              }
              label="Dark Mode"
            />
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={20} /> : "Save Settings"}
            </Button>
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          More settings coming soon...
        </Typography>
      </Paper>
    </Box>
  );
}

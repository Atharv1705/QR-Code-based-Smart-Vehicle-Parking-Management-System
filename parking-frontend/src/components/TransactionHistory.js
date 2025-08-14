import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function TransactionHistory({ user, api, onNotify }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/history?username=${user.username}`);
      setHistory(res.data.history || []);
    } catch {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: 4 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 600, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Transaction History
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {history.map((tx, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`Slot #${tx.slotId} - ${tx.action}`}
                  secondary={`Time: ${tx.timestamp}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

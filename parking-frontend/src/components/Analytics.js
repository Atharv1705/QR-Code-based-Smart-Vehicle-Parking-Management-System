import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function Analytics({ user, api }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/analytics");
      setStats(res.data.stats || []);
    } catch {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", p: 4 }}>
      <Paper
        elevation={3}
        sx={{ maxWidth: 800, mx: "auto", p: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Analytics
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2}>
            {stats.map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{ bgcolor: "#2196f3", color: "white", borderRadius: 2 }}
                >
                  <CardContent>
                    <Typography variant="h6">{stat.label}</Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}

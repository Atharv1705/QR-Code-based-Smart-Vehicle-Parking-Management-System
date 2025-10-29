import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Container,
  useTheme,
  alpha,
  Fade,
  Button,
  ButtonGroup,
  Avatar,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  DirectionsCar,
  LocalParking,
  AccountBalanceWallet,
  Schedule,
  Refresh,
} from "@mui/icons-material";

const MetricCard = ({ title, value, change, icon, color, trend, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].light, 0.05)})`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ textAlign: "right" }}>
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {trend === "up" ? (
                  <TrendingUp sx={{ color: "success.main", fontSize: 20, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: "error.main", fontSize: 20, mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend === "up" ? "success.main" : "error.main"}
                  fontWeight={600}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const UsageChart = ({ title, data, color }) => {
  const theme = useTheme();
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card sx={{ 
      height: "100%", 
      borderRadius: 3,
      boxShadow: theme.shadows[4],
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mt: 3 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.value}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(item.value / maxValue) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.grey[300], 0.3),
                }}
                color={color}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const RevenueCard = () => {
  const theme = useTheme();
  const revenueData = [
    { period: "Today", amount: 1250, change: "+12%" },
    { period: "This Week", amount: 8750, change: "+8%" },
    { period: "This Month", amount: 32500, change: "+15%" },
  ];

  return (
    <Card sx={{ 
      height: "100%", 
      borderRadius: 3,
      boxShadow: theme.shadows[4],
      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
      background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, ${alpha(theme.palette.success.light, 0.02)})`
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: "success.main",
              mr: 2,
            }}
          >
            <AccountBalanceWallet />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            Revenue Overview
          </Typography>
        </Box>
        {revenueData.map((item, index) => (
          <Box key={index}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item.period}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  ₹{item.amount.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  {item.change}
                </Typography>
              </Box>
            </Box>
            {index < revenueData.length - 1 && <Divider />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default function Analytics({ api }) {
  const theme = useTheme();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("today");

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

  const hourlyUsage = [
    { label: "6 AM - 9 AM", value: 85 },
    { label: "9 AM - 12 PM", value: 92 },
    { label: "12 PM - 3 PM", value: 78 },
    { label: "3 PM - 6 PM", value: 95 },
    { label: "6 PM - 9 PM", value: 88 },
    { label: "9 PM - 12 AM", value: 45 },
  ];

  const vehicleTypes = [
    { label: "Sedans", value: 45 },
    { label: "SUVs", value: 32 },
    { label: "Trucks", value: 15 },
    { label: "Motorcycles", value: 8 },
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "background.default", 
      display: "flex",
      flexDirection: "column"
    }}>
      <Container maxWidth="xl" sx={{ 
        flex: 1, 
        py: { xs: 3, sm: 4 }, 
        px: { xs: 2, sm: 3 },
        pt: { xs: 10, sm: 11 }, // Account for fixed AppBar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '1400px' }}>
            {/* Header */}
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", lg: "row" },
              justifyContent: "space-between", 
              alignItems: "center", 
              mb: { xs: 3, sm: 4 },
              gap: 2,
              textAlign: "center"
            }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                  Analytics Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Comprehensive insights into your parking facility performance
                </Typography>
              </Box>
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: { xs: "100%", lg: "auto" }
              }}>
                <ButtonGroup 
                  variant="outlined" 
                  sx={{ 
                    width: { xs: "100%", sm: "auto" },
                    "& .MuiButton-root": { 
                      flex: { xs: 1, sm: "none" } 
                    }
                  }}
                >
                  <Button
                    variant={timeRange === "today" ? "contained" : "outlined"}
                    onClick={() => setTimeRange("today")}
                  >
                    Today
                  </Button>
                  <Button
                    variant={timeRange === "week" ? "contained" : "outlined"}
                    onClick={() => setTimeRange("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={timeRange === "month" ? "contained" : "outlined"}
                    onClick={() => setTimeRange("month")}
                  >
                    Month
                  </Button>
                </ButtonGroup>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchStats}
                  disabled={loading}
                  sx={{ minWidth: { xs: "100%", sm: 120 } }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            ) : (
              <>
                {/* Key Metrics */}
                <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }} justifyContent="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Total Vehicles Today"
                      value="127"
                      change="+12%"
                      icon={<DirectionsCar />}
                      color="primary"
                      trend="up"
                      subtitle="vs yesterday"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Average Duration"
                      value="2.5h"
                      change="-5%"
                      icon={<Schedule />}
                      color="info"
                      trend="down"
                      subtitle="per vehicle"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Peak Occupancy"
                      value="94%"
                      change="+8%"
                      icon={<LocalParking />}
                      color="warning"
                      trend="up"
                      subtitle="at 2:30 PM"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                      title="Revenue Today"
                      value="₹1,250"
                      change="+15%"
                      icon={<AccountBalanceWallet />}
                      color="success"
                      trend="up"
                      subtitle="vs yesterday"
                    />
                  </Grid>
                </Grid>

                {/* Charts and Detailed Analytics */}
                <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
                  <Grid item xs={12} md={4}>
                    <UsageChart
                      title="Hourly Usage Pattern"
                      data={hourlyUsage}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <UsageChart
                      title="Vehicle Types"
                      data={vehicleTypes}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RevenueCard />
                  </Grid>
                </Grid>

                {/* Additional Stats from API */}
                {stats.length > 0 && (
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {stats.map((stat, i) => (
                      <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card
                          sx={{
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          }}
                        >
                          <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                              {stat.value}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {stat.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

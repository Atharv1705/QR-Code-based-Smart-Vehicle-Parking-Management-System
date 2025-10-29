import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Container,
  CircularProgress,
} from "@mui/material";
import {
  DirectionsCar,
  LocalParking,
  History,
  Analytics,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Add,
  QrCodeScanner,
} from "@mui/icons-material";

const StatCard = ({ title, value, change, icon, color, trend }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)}, ${alpha(theme.palette[color].light, 0.05)})`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
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
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          {trend === "up" ? (
            <TrendingUp sx={{ color: "success.main", mr: 1, fontSize: 20 }} />
          ) : (
            <TrendingDown sx={{ color: "error.main", mr: 1, fontSize: 20 }} />
          )}
          <Typography
            variant="body2"
            color={trend === "up" ? "success.main" : "error.main"}
            fontWeight={600}
          >
            {change}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            vs last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const QuickActionCard = ({ title, description, icon, color, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: `${color}.main`,
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const RecentActivity = ({ activities, loading }) => {

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Recent Activity
          </Typography>
          <Button size="small" endIcon={<History />}>
            View All
          </Button>
        </Box>
        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : activities.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            </Box>
          ) : (
            activities.map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 2,
                    bgcolor: activity.type === "entry" ? "success.main" :
                      activity.type === "exit" ? "warning.main" : "primary.main",
                  }}
                >
                  {activity.type === "entry" ? "E" : activity.type === "exit" ? "X" : "U"}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default function Dashboard({ onNavigate, user }) {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalSlots: 0,
    occupiedSlots: 0,
    availableSlots: 0,
    todayRevenue: 0,
    todayVehicles: 0,
    averageDuration: "0h 0m",
    peakOccupancy: "0%",
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard statistics
      const statsRes = await fetch("http://localhost:8080/api/dashboard/stats");
      const statsData = await statsRes.json();

      // Fetch recent transactions for activity
      const transactionsRes = await fetch("http://localhost:8080/api/transactions");
      const transactionsData = await transactionsRes.json();

      setStats(statsData);

      // Process recent activity from transactions
      const recent = (transactionsData.transactions || [])
        .slice(0, 4)
        .map(tx => ({
          id: tx.id,
          action: tx.exitTime ? `Vehicle ${tx.plateNumber} exited from slot ${tx.slotId}` : `Vehicle ${tx.plateNumber} entered slot ${tx.slotId}`,
          time: getRelativeTime(tx.exitTime || tx.entryTime),
          type: tx.exitTime ? "exit" : "entry"
        }));

      setRecentActivity(recent);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return "Unknown";
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const occupancyRate = stats.totalSlots > 0 ? (stats.occupiedSlots / stats.totalSlots) * 100 : 0;

  const quickActions = [
    {
      title: "Parking Management",
      description: "Manage vehicle entry and exit",
      icon: <DirectionsCar sx={{ fontSize: 32 }} />,
      color: "primary",
      onClick: () => onNavigate("parking"),
    },
    {
      title: "Slot Management",
      description: "Add or remove parking slots",
      icon: <LocalParking sx={{ fontSize: 32 }} />,
      color: "secondary",
      onClick: () => onNavigate("slots"),
    },
    {
      title: "QR Scanner",
      description: "Scan QR codes for quick entry",
      icon: <QrCodeScanner sx={{ fontSize: 32 }} />,
      color: "success",
      onClick: () => onNavigate("qrscanner"),
    },
    {
      title: "Analytics",
      description: "View detailed reports",
      icon: <Analytics sx={{ fontSize: 32 }} />,
      color: "info",
      onClick: () => onNavigate("analytics"),
    },
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
              textAlign: "center",
              mb: { xs: 3, sm: 4 }
            }}>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2.125rem' }
                }}
              >
                Welcome back, {user?.username || "User"}! 👋
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Here's what's happening with your parking facility today.
              </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }} justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Slots"
                  value={stats.totalSlots}
                  change="+2.5%"
                  icon={<LocalParking sx={{ fontSize: 28 }} />}
                  color="primary"
                  trend="up"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Occupied Slots"
                  value={stats.occupiedSlots}
                  change="+12.3%"
                  icon={<DirectionsCar sx={{ fontSize: 28 }} />}
                  color="warning"
                  trend="up"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Available Slots"
                  value={stats.availableSlots}
                  change="-8.1%"
                  icon={<Add sx={{ fontSize: 28 }} />}
                  color="success"
                  trend="down"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Today's Revenue"
                  value={`₹${stats.todayRevenue}`}
                  change="+15.2%"
                  icon={<TrendingUp sx={{ fontSize: 28 }} />}
                  color="info"
                  trend="up"
                />
              </Grid>
            </Grid>

            {/* Occupancy Rate */}
            <Card sx={{ mb: { xs: 2, sm: 3 }, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  mb: 2,
                  gap: 2
                }}>
                  <Typography variant="h6" fontWeight={600}>
                    Occupancy Rate
                  </Typography>
                  <Chip
                    label={`${occupancyRate.toFixed(1)}%`}
                    color={occupancyRate > 80 ? "error" : occupancyRate > 60 ? "warning" : "success"}
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={occupancyRate}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: alpha(theme.palette.grey[300], 0.3),
                    mb: 2,
                  }}
                  color={occupancyRate > 80 ? "error" : occupancyRate > 60 ? "warning" : "success"}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {stats.occupiedSlots} of {stats.totalSlots} slots occupied
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {stats.availableSlots} available
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Main Content Grid - Side by Side Layout */}
            <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center" alignItems="stretch">
              {/* Left Column - Quick Actions */}
              <Grid item xs={12} md={6} lg={7}>
                <Card sx={{
                  height: '100%',
                  p: { xs: 2, sm: 3 },
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.light, 0.01)})`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        Quick Actions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage your parking facility efficiently
                      </Typography>
                    </Box>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      {quickActions.map((action, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <QuickActionCard {...action} />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Column - Recent Activity & Additional Stats */}
              <Grid item xs={12} md={6} lg={5}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 }, height: '100%' }}>
                  {/* Recent Activity */}
                  <Box sx={{ flex: 1 }}>
                    <RecentActivity activities={recentActivity} loading={loading} />
                  </Box>

                  {/* Additional Stats Card */}
                  <Card sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, ${alpha(theme.palette.success.light, 0.02)})`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Today's Summary
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                              {stats.todayVehicles}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Vehicles Today
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                              {stats.averageDuration}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Avg Duration
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

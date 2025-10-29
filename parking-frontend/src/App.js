import { useState } from "react";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

import QRScanner from "./components/QRScanner";
import Login from "./components/Login";
import Register from "./components/Register";
import ParkingManagement from "./components/ParkingManagement";
import SlotManagement from "./components/SlotManagement";
import TransactionHistory from "./components/TransactionHistory";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import AppBarNav from "./components/AppBarNav";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
  Typography,
  useTheme,
  alpha,
  ListItemButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  DirectionsCar,
  History,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LocalParking,
  QrCodeScanner,
  Person,
} from "@mui/icons-material";
import axios from "axios";
import UserProfile from "./components/UserProfile";
import NotificationBar from "./components/NotificationBar";
import "./utils/connectionTest"; // Load connection test utilities

// API configuration
const API = axios.create({ baseURL: "http://localhost:8080/api" });

function App() {
  const theme = useTheme();
  const [page, setPage] = useState(() => {
    // Check if user was previously logged in
    const savedUser = localStorage.getItem('parkingUser');
    return savedUser ? "dashboard" : "landing";
  });
  const [user, setUser] = useState(() => {
    // Restore user from localStorage
    const savedUser = localStorage.getItem('parkingUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('parkingUser', JSON.stringify(userData));
    setPage("dashboard");
    setNotification({
      open: true,
      message: `Welcome back, ${userData.username}!`,
      severity: "success",
    });
  };

  const handleNavigate = (to) => {
    setDrawerOpen(false);
    if (to === "logout") {
      setUser(null);
      localStorage.removeItem('parkingUser');
      localStorage.removeItem('authToken');
      setPage("landing");
      setNotification({
        open: true,
        message: "Logged out successfully",
        severity: "info",
      });
    } else {
      setPage(to);
    }
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, page: "dashboard" },
    { text: "Parking", icon: <DirectionsCar />, page: "parking" },
    { text: "Slots", icon: <LocalParking />, page: "slots" },
    { text: "QR Scanner", icon: <QrCodeScanner />, page: "qrscanner" },
    { text: "History", icon: <History />, page: "history" },
    { text: "Analytics", icon: <AnalyticsIcon />, page: "analytics" },
    { text: "Settings", icon: <SettingsIcon />, page: "settings" },
    { text: "Profile", icon: <Person />, page: "profile" },
  ];

  const isAuthenticated = !!user;
  const showNavigation = isAuthenticated && !["landing", "login", "register"].includes(page);

  return (
    <ThemeContextProvider>
      <CssBaseline />
      
      {/* Navigation Drawer */}
      {showNavigation && (
        <>
          <AppBarNav
            title="SmartPark"
            onMenu={() => setDrawerOpen(true)}
            user={user}
            onNavigate={handleNavigate}
          />
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            variant="temporary"
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}

            sx={{
              '& .MuiDrawer-paper': {
                width: 280,
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
              },
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <Box 
              sx={{ 
                width: 280, 
                height: '100%',
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                flexDirection: 'column',
              }} 
              role="presentation"
            >
              {/* User Profile Section */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                  px: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: "white",
                  boxShadow: theme.shadows[2],
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 2,
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 32,
                    border: "3px solid rgba(255,255,255,0.3)",
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                >
                  {user?.username ? user.username[0].toUpperCase() : "U"}
                </Avatar>
                <Typography variant="h6" fontWeight={600} sx={{ color: 'white' }}>
                  {user?.username || "Guest"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                  Parking Manager
                </Typography>
              </Box>

              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

              {/* Navigation Items */}
              <List sx={{ 
                py: 2, 
                flex: 1,
                backgroundColor: theme.palette.background.paper,
              }}>
                {navItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigate(item.page)}
                      sx={{
                        mx: 2,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                        ...(page === item.page && {
                          bgcolor: alpha(theme.palette.primary.main, 0.15),
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }),
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: page === item.page ? "primary.main" : "#64748b",
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: page === item.page ? 600 : 400,
                            color: page === item.page ? "#2563eb" : "#1e293b",
                          }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
                
                <Divider sx={{ my: 2, mx: 2, backgroundColor: '#e2e8f0' }} />
                
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigate("logout")}
                    sx={{
                      mx: 2,
                      borderRadius: 2,
                      color: "error.main",
                      backgroundColor: 'transparent',
                      "&:hover": {
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#ef4444", minWidth: 40 }}>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Logout" 
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: "#ef4444",
                          fontWeight: 500,
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </>
      )}

      {/* Page Content */}
      {page === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {page === "login" && <Login onLogin={handleLogin} onNavigate={handleNavigate} />}
      {page === "register" && <Register onRegister={handleLogin} onNavigate={handleNavigate} />}
      {page === "dashboard" && (
        <Dashboard onNavigate={handleNavigate} user={user} />
      )}
      {page === "parking" && (
        <ParkingManagement api={API} onNotify={setNotification} />
      )}
      {page === "slots" && (
        <SlotManagement user={user} api={API} onNotify={setNotification} />
      )}
      {page === "history" && (
        <TransactionHistory user={user} api={API} onNotify={setNotification} />
      )}
      {page === "analytics" && <Analytics api={API} />}
      {page === "settings" && <Settings user={user} api={API} onNotify={setNotification} />}
      {page === "profile" && (
        <UserProfile
          user={user}
          api={API}
          onSave={(u) => {
            setUser(u);
            setNotification({
              open: true,
              message: "Profile updated successfully!",
              severity: "success",
            });
          }}
        />
      )}
      {page === "qrscanner" && (
        <QRScanner
          user={user}
          onNotify={setNotification}
          onScan={(data) =>
            setNotification({
              open: true,
              message: `QR Code scanned: ${data}`,
              severity: "info",
            })
          }
        />
      )}

      {/* Global Notification */}
      <NotificationBar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </ThemeContextProvider>
  );
}

export default App;

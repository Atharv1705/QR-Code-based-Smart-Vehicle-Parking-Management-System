import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import QRCodeGen from "./components/QRCodeGen";
import QRScanner from "./components/QRScanner";
import Login from "./components/Login";
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
  IconButton,
  Box,
  Avatar,
  Divider,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import axios from "axios";
import UserProfile from "./components/UserProfile";
import NotificationBar from "./components/NotificationBar";

// Example API base URL (adjust as needed)
const API = axios.create({ baseURL: "http://localhost:8080/api" });

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Example login handler with backend call
  const handleLogin = async ({ username, password }) => {
    try {
      // Replace with your backend login endpoint
      const res = await API.post("/login", { username, password });
      if (res.data.success) {
        setUser(res.data.user);
        setPage("dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("Server error");
    }
  };

  const handleNavigate = (to) => {
    setDrawerOpen(false);
    if (to === "logout") {
      setUser(null);
      setPage("login");
    } else {
      setPage(to);
    }
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, page: "dashboard" },
    { text: "Parking", icon: <DirectionsCarIcon />, page: "parking" },
    { text: "Slots", icon: <DirectionsCarIcon />, page: "slots" },
    { text: "History", icon: <HistoryIcon />, page: "history" },
    { text: "Analytics", icon: <AnalyticsIcon />, page: "analytics" },
    { text: "Settings", icon: <SettingsIcon />, page: "settings" },
    {
      text: "Profile",
      icon: (
        <Avatar
          sx={{
            width: 24,
            height: 24,
            bgcolor: "#1976d2",
            color: "white",
            fontSize: 14,
          }}
        >
          {user && user.username ? user.username[0].toUpperCase() : "U"}
        </Avatar>
      ),
      page: "profile",
    },
    { text: "Logout", icon: <LogoutIcon />, page: "logout" },
  ];

  return (
    <>
      <CssBaseline />
      {page !== "login" && (
        <>
          <AppBarNav
            title="Vehicle Parking System"
            onMenu={() => setDrawerOpen(true)}
          />
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 260 }} role="presentation">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 3,
                  bgcolor: "#1976d2",
                  color: "white",
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mb: 1,
                    bgcolor: "#fff",
                    color: "#1976d2",
                    fontWeight: "bold",
                    fontSize: 32,
                  }}
                >
                  {user && user.username ? (
                    user.username[0].toUpperCase()
                  ) : (
                    <DirectionsCarIcon fontSize="large" />
                  )}
                </Avatar>
                <Typography variant="h6">
                  {user && user.username ? user.username : "Guest"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Vehicle Owner
                </Typography>
              </Box>
              <Divider />
              <List>
                {navItems.map((item) => (
                  <ListItem
                    button
                    key={item.text}
                    onClick={() => handleNavigate(item.page)}
                  >
                    <ListItemIcon sx={{ color: "#1976d2" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </>
      )}
      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "dashboard" && (
        <Dashboard onNavigate={handleNavigate} user={user} />
      )}
      {page === "parking" && (
        <ParkingManagement user={user} api={API} onNotify={setNotification} />
      )}
      {page === "slots" && (
        <SlotManagement user={user} api={API} onNotify={setNotification} />
      )}
      {page === "history" && (
        <TransactionHistory user={user} api={API} onNotify={setNotification} />
      )}
      {page === "analytics" && <Analytics user={user} api={API} />}
      {page === "settings" && <Settings user={user} api={API} />}
      {page === "profile" && (
        <UserProfile
          user={user}
          onSave={(u) => {
            setUser(u);
            setNotification({
              open: true,
              message: "Profile updated!",
              severity: "success",
            });
          }}
        />
      )}
      {page === "qrscanner" && (
        <QRScanner
          onScan={(data) =>
            setNotification({
              open: true,
              message: "Scanned: " + data,
              severity: "info",
            })
          }
        />
      )}
      <NotificationBar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </>
  );
}

export default App;

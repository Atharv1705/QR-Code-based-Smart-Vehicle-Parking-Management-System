import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DirectionsCar,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useState } from "react";
import { useThemeMode } from "../contexts/ThemeContext";

export default function AppBarNav({ title, onMenu, user, onNavigate }) {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleMenuClick = (page) => {
    handleProfileMenuClose();
    onNavigate(page);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: "blur(20px)",
        background: `${alpha(theme.palette.background.paper, 0.8)}`,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenu}
          sx={{
            mr: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <DirectionsCar sx={{ color: "primary.main", mr: 1, fontSize: 28 }} />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            {title || "QR Smart Parking"}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Toggle */}
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ mr: 1 }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Notifications */}
        <IconButton
          color="inherit"
          onClick={handleNotificationOpen}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <IconButton
          edge="end"
          aria-label="account of current user"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {user?.username ? user.username[0].toUpperCase() : "U"}
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          slotProps={{
            paper: {
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.username || "Guest"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Parking Manager
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => handleMenuClick("profile")}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick("settings")}>
            <Settings sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuClick("logout")} sx={{ color: "error.main" }}>
            <Logout sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          slotProps={{
            paper: {
              elevation: 8,
              sx: {
                mt: 1.5,
                minWidth: 300,
                maxWidth: 400,
                borderRadius: 2,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Divider />
          <MenuItem>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Vehicle ABC123 entered
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Slot 5 released
              </Typography>
              <Typography variant="caption" color="text.secondary">
                5 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                New user registered
              </Typography>
              <Typography variant="caption" color="text.secondary">
                10 minutes ago
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

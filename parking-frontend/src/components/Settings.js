import { useEffect, useState } from "react";
import { useThemeMode } from "../contexts/ThemeContext";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  Slider,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Notifications,
  Security,
  Palette,
  Storage,
  VolumeUp,
  Email,
  Sms,
  Lock,
  Visibility,
  Backup,
  Update,
  CheckCircle,
} from "@mui/icons-material";

export default function Settings({ api, onNotify }) {
  const theme = useTheme();
  const { themeMode, setTheme, isDark } = useThemeMode();
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: false,
      sms: false,
      sound: true,
      vibration: true,
    },
    privacy: {
      profileVisibility: "public",
      dataSharing: false,
      analytics: true,
      locationTracking: false,
    },
    appearance: {
      theme: themeMode,
      language: "en",
      fontSize: "medium",
      animations: true,
    },
    system: {
      autoRefresh: true,
      refreshInterval: 30,
      cacheSize: "100MB",
      offlineMode: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
      passwordExpiry: 90,
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetDialog, setResetDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/settings");
      if (res.data.settings) {
        setSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // Sync settings with current theme
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, theme: themeMode }
    }));
    // eslint-disable-next-line
  }, [themeMode]);

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const handleSelectChange = (category, key) => (event) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: event.target.value
      }
    }));
  };

  const handleSliderChange = (category, key) => (event, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await api.post("/settings", settings);
      onNotify?.({
        open: true,
        message: "Settings saved successfully!",
        severity: "success",
      });
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      notifications: {
        push: true,
        email: false,
        sms: false,
        sound: true,
        vibration: true,
      },
      privacy: {
        profileVisibility: "public",
        dataSharing: false,
        analytics: true,
        locationTracking: false,
      },
      appearance: {
        theme: "light",
        language: "en",
        fontSize: "medium",
        animations: true,
      },
      system: {
        autoRefresh: true,
        refreshInterval: 30,
        cacheSize: "100MB",
        offlineMode: false,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        loginAlerts: true,
        passwordExpiry: 90,
      }
    });
    setResetDialog(false);
    onNotify?.({
      open: true,
      message: "Settings reset to defaults",
      severity: "info",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parking-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportDialog(false);
    onNotify?.({
      open: true,
      message: "Settings exported successfully",
      severity: "success",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "background.default", 
      display: "flex",
      flexDirection: "column"
    }}>
      <Container maxWidth="xl" sx={{ 
        flex: 1, 
        py: { xs: 4, sm: 5 }, 
        px: { xs: 2, sm: 4 },
        pt: { xs: 12, sm: 13 }, // Increased padding for fixed AppBar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '1400px' }}>
            {/* Header */}
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between", 
              alignItems: { xs: "center", md: "center" }, 
              mb: { xs: 4, sm: 5 },
              gap: 2,
              textAlign: { xs: 'center', md: 'center' },
              maxWidth: "800px",
              mx: "auto"
            }}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                  Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Customize your parking management experience
                </Typography>
              </Box>
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: { xs: "100%", md: "auto" }
              }}>
                <Button
                  variant="outlined"
                  onClick={() => setExportDialog(true)}
                  startIcon={<Backup />}
                  size="medium"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Export
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => setResetDialog(true)}
                  startIcon={<Update />}
                  size="medium"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <CheckCircle />}
                  size="medium"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center" alignItems="stretch">
              {/* Notifications Settings */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ 
                  boxShadow: theme.shadows[3],
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", mr: 2 }}>
                        <Notifications />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        Notifications
                      </Typography>
                    </Box>
                    <List>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ListItemIcon>
                            <Notifications color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Push Notifications" secondary="Receive real-time updates" />
                        </Box>
                        <Switch
                          checked={settings.notifications.push}
                          onChange={() => handleToggle("notifications", "push")}
                        />
                      </ListItem>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ListItemIcon>
                            <Email color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Email Alerts" secondary="Get notified via email" />
                        </Box>
                        <Switch
                          checked={settings.notifications.email}
                          onChange={() => handleToggle("notifications", "email")}
                        />
                      </ListItem>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ListItemIcon>
                            <Sms color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="SMS Alerts" secondary="Receive text messages" />
                        </Box>
                        <Switch
                          checked={settings.notifications.sms}
                          onChange={() => handleToggle("notifications", "sms")}
                        />
                      </ListItem>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ListItemIcon>
                            <VolumeUp color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Sound Effects" secondary="Play notification sounds" />
                        </Box>
                        <Switch
                          checked={settings.notifications.sound}
                          onChange={() => handleToggle("notifications", "sound")}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Privacy Settings */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ 
                  boxShadow: theme.shadows[3],
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%' }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: "success.main", mr: 2 }}>
                        <Security />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        Privacy & Security
                      </Typography>
                    </Box>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Visibility color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Profile Visibility" 
                          secondary={
                            <FormControl size="small" sx={{ mt: 1, minWidth: 120 }}>
                              <Select
                                value={settings.privacy.profileVisibility}
                                onChange={handleSelectChange("privacy", "profileVisibility")}
                              >
                                <MenuItem value="public">Public</MenuItem>
                                <MenuItem value="private">Private</MenuItem>
                                <MenuItem value="friends">Friends Only</MenuItem>
                              </Select>
                            </FormControl>
                          }
                        />
                      </ListItem>
                      <ListItem>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ListItemIcon>
                            <Storage color="success" />
                          </ListItemIcon>
                          <ListItemText primary="Data Sharing" secondary="Share usage data for improvements" />
                        </Box>
                        <Switch
                          checked={settings.privacy.dataSharing}
                          onChange={() => handleToggle("privacy", "dataSharing")}
                        />
                      </ListItem>
                      </ListItem>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ListItemIcon>
                            <Lock color="success" />
                          </ListItemIcon>
                          <ListItemText primary="Two-Factor Authentication" secondary="Extra security for your account" />
                        </Box>
                        <Switch
                          checked={settings.security.twoFactorAuth}
                          onChange={() => handleToggle("security", "twoFactorAuth")}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Appearance Settings */}
              <Grid item xs={12} lg={6}>
                  <Card sx={{ 
                    boxShadow: theme.shadows[3],
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    height: '100%',
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%' }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: "secondary.main", mr: 2 }}>
                        <Palette />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        Appearance
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Theme</Typography>
                        <Chip 
                          label={`Currently: ${isDark ? 'Dark' : 'Light'}`}
                          size="small"
                          color={isDark ? 'secondary' : 'primary'}
                          variant="outlined"
                        />
                      </Box>
                      <FormControl fullWidth size="small">
                        <Select
                          value={themeMode}
                          onChange={(event) => {
                            const newTheme = event.target.value;
                            setTheme(newTheme);
                            setSettings(prev => ({
                              ...prev,
                              appearance: { ...prev.appearance, theme: newTheme }
                            }));
                          }}
                        >
                          <MenuItem value="light">🌞 Light</MenuItem>
                          <MenuItem value="dark">🌙 Dark</MenuItem>
                          <MenuItem value="auto">🔄 Auto (System)</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" gutterBottom>Language</Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={settings.appearance.language}
                          onChange={handleSelectChange("appearance", "language")}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                          <MenuItem value="zh">Chinese</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" gutterBottom>Font Size</Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={settings.appearance.fontSize}
                          onChange={handleSelectChange("appearance", "fontSize")}
                        >
                          <MenuItem value="small">Small</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="large">Large</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.appearance.animations}
                          onChange={() => handleToggle("appearance", "animations")}
                        />
                      }
                      label="Enable Animations"
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* System Settings */}
              <Grid item xs={12} lg={6}>
                  <Card sx={{ 
                    boxShadow: theme.shadows[3],
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    height: '100%',
                    transition: 'all 0.3s ease'
                  }}>
                    <CardContent sx={{ p: { xs: 3, sm: 4 }, height: '100%' }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: "info.main", mr: 2 }}>
                        <Storage />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        System
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.system.autoRefresh}
                            onChange={() => handleToggle("system", "autoRefresh")}
                          />
                        }
                        label="Auto Refresh Data"
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" gutterBottom>
                        Refresh Interval: {settings.system.refreshInterval} seconds
                      </Typography>
                      <Slider
                        value={settings.system.refreshInterval}
                        onChange={handleSliderChange("system", "refreshInterval")}
                        min={10}
                        max={300}
                        step={10}
                        marks={[
                          { value: 10, label: '10s' },
                          { value: 60, label: '1m' },
                          { value: 300, label: '5m' }
                        ]}
                        disabled={!settings.system.autoRefresh}
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" gutterBottom>Cache Size</Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {["50MB", "100MB", "200MB", "500MB"].map((size) => (
                          <Chip
                            key={size}
                            label={size}
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              system: { ...prev.system, cacheSize: size }
                            }))}
                            color={settings.system.cacheSize === size ? "primary" : "default"}
                            variant={settings.system.cacheSize === size ? "filled" : "outlined"}
                          />
                        ))}
                      </Box>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.system.offlineMode}
                          onChange={() => handleToggle("system", "offlineMode")}
                        />
                      }
                      label="Offline Mode"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* System Information */}
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  System Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="primary.main" fontWeight={700}>
                        v2.1.0
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        App Version
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="success.main" fontWeight={700}>
                        Online
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Connection Status
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="info.main" fontWeight={700}>
                        {settings.system.cacheSize}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cache Usage
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="warning.main" fontWeight={700}>
                        {new Date().toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Fade>

        {/* Reset Confirmation Dialog */}
        <Dialog open={resetDialog} onClose={() => setResetDialog(false)}>
          <DialogTitle>Reset Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to reset all settings to their default values? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialog(false)}>Cancel</Button>
            <Button onClick={handleReset} color="warning" variant="contained">
              Reset All Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Confirmation Dialog */}
        <Dialog open={exportDialog} onClose={() => setExportDialog(false)}>
          <DialogTitle>Export Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will download your current settings as a JSON file. 
              You can use this file to backup or transfer your settings.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialog(false)}>Cancel</Button>
            <Button onClick={handleExport} variant="contained">
              Export Settings
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

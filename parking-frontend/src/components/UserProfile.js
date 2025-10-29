import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
  Security,
  Notifications,
  CameraAlt,
  DirectionsCar,
  History,
  AccountBalanceWallet,
} from "@mui/icons-material";

export default function UserProfile({ user, api, onSave }) {
  const theme = useTheme();
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "user@example.com",
    phone: user?.phone || "",
    address: user?.address || "",
    occupation: user?.occupation || "",
    joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
    bio: user?.bio || "",
    preferences: {
      notifications: true,
      emailAlerts: false,
      smsAlerts: false,
      language: "en",
      theme: "light",
    }
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarDialog, setAvatarDialog] = useState(false);
  const [stats, setStats] = useState({
    totalParkingSessions: 0,
    totalSpent: 0,
    averageSession: "0h 0m",
    favoriteSlot: "N/A"
  });

  useEffect(() => {
    fetchUserStats();
    // eslint-disable-next-line
  }, []);

  const fetchUserStats = async () => {
    try {
      // Mock user statistics - in real app, fetch from API
      setStats({
        totalParkingSessions: 45,
        totalSpent: 180.50,
        averageSession: "2h 15m",
        favoriteSlot: "Slot 7"
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePreferenceChange = (field) => (event) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: event.target.checked !== undefined ? event.target.checked : event.target.value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/profile", profileData);
      setEditing(false);
      if (onSave) onSave({ ...user, ...profileData });
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      username: user?.username || "",
      email: user?.email || "user@example.com",
      phone: user?.phone || "",
      address: user?.address || "",
      occupation: user?.occupation || "",
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
      bio: user?.bio || "",
      preferences: {
        notifications: true,
        emailAlerts: false,
        smsAlerts: false,
        language: "en",
        theme: "light",
      }
    });
    setEditing(false);
    setError("");
  };

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
          <Box sx={{ width: '100%', maxWidth: '1400px' }}> {/* Increased max width for better layout */}
            {/* Header */}
            <Box sx={{ 
              textAlign: "center", 
              mb: { xs: 4, sm: 5 },
              maxWidth: "800px",
              mx: "auto"
            }}>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1.5 }}>
                User Profile
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your account information and preferences
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="flex-start">
              {/* Left Side - Profile Information */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ 
                  boxShadow: theme.shadows[6],
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.background.paper, 1)})`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[12],
                  }
                }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                      <Typography variant="h5" fontWeight={700} color="primary.main">
                        Profile Information
                      </Typography>
                      <Box>
                        {editing ? (
                          <>
                            <Button
                              variant="contained"
                              startIcon={<Save />}
                              onClick={handleSave}
                              disabled={loading}
                              sx={{ 
                                mr: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<Cancel />}
                              onClick={handleCancel}
                              color="error"
                              sx={{ 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => setEditing(true)}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                              '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                              }
                            }}
                          >
                            Edit Profile
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* Avatar Section */}
                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "center", sm: "flex-start" },
                      textAlign: { xs: "center", sm: "left" },
                      mb: 4,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`
                    }}>
                      <Box sx={{ position: "relative", mb: { xs: 2, sm: 0 } }}>
                        <Avatar
                          sx={{
                            width: { xs: 80, sm: 100 },
                            height: { xs: 80, sm: 100 },
                            bgcolor: "primary.main",
                            fontSize: { xs: 32, sm: 40 },
                            fontWeight: 700,
                            boxShadow: theme.shadows[4],
                            border: `3px solid ${theme.palette.background.paper}`,
                          }}
                        >
                          {profileData.username && profileData.username[0] ? 
                            profileData.username[0].toUpperCase() : "U"}
                        </Avatar>
                        {editing && (
                          <IconButton
                            sx={{
                              position: "absolute",
                              bottom: -5,
                              right: -5,
                              bgcolor: "primary.main",
                              color: "white",
                              boxShadow: theme.shadows[4],
                              "&:hover": { 
                                bgcolor: "primary.dark",
                                transform: 'scale(1.1)'
                              },
                            }}
                            size="small"
                            onClick={() => setAvatarDialog(true)}
                          >
                            <CameraAlt fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                      <Box sx={{ ml: { xs: 0, sm: 3 } }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          {profileData.username}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          {profileData.email}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
                          <Chip
                            label="Premium Member"
                            color="primary"
                            variant="filled"
                            sx={{ 
                              fontWeight: 600,
                              borderRadius: 2
                            }}
                          />
                          <Chip
                            label="Verified"
                            color="success"
                            variant="outlined"
                            sx={{ 
                              fontWeight: 600,
                              borderRadius: 2
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {error && (
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    )}

                    {/* Form Fields */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Username"
                          value={profileData.username}
                          onChange={handleInputChange("username")}
                          fullWidth
                          disabled={!editing || loading}
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              borderRadius: 2,
                            }
                          }}
                          slotProps={{
                            input: {
                              startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange("email")}
                          fullWidth
                          disabled={!editing || loading}
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              borderRadius: 2,
                            }
                          }}
                          slotProps={{
                            input: {
                              startAdornment: <Email sx={{ mr: 1, color: "text.secondary" }} />,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Phone Number"
                          value={profileData.phone}
                          onChange={handleInputChange("phone")}
                          fullWidth
                          disabled={!editing || loading}
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              borderRadius: 2,
                            }
                          }}
                          slotProps={{
                            input: {
                              startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} />,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Occupation"
                          value={profileData.occupation}
                          onChange={handleInputChange("occupation")}
                          fullWidth
                          disabled={!editing || loading}
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              borderRadius: 2,
                            }
                          }}
                          slotProps={{
                            input: {
                              startAdornment: <Work sx={{ mr: 1, color: "text.secondary" }} />,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Address"
                          value={profileData.address}
                          onChange={handleInputChange("address")}
                          fullWidth
                          disabled={!editing || loading}
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              borderRadius: 2,
                            }
                          }}
                          slotProps={{
                            input: {
                              startAdornment: <LocationOn sx={{ mr: 1, color: "text.secondary" }} />,
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Bio"
                          value={profileData.bio}
                          onChange={handleInputChange("bio")}
                          fullWidth
                          multiline
                          rows={3}
                          disabled={!editing || loading}
                          placeholder="Tell us about yourself..."
                          sx={{ 
                            '& .MuiInputBase-root': { 
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Preferences Section */}
                    {editing && (
                      <>
                        <Divider sx={{ my: 4 }} />
                        <Typography variant="h6" fontWeight={600} gutterBottom color="primary.main">
                          Preferences
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={profileData.preferences.notifications}
                                  onChange={handlePreferenceChange("notifications")}
                                  color="primary"
                                />
                              }
                              label="Push Notifications"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={profileData.preferences.emailAlerts}
                                  onChange={handlePreferenceChange("emailAlerts")}
                                  color="primary"
                                />
                              }
                              label="Email Alerts"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Language</InputLabel>
                              <Select
                                value={profileData.preferences.language}
                                onChange={handlePreferenceChange("language")}
                                label="Language"
                                sx={{ borderRadius: 2 }}
                              >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Spanish</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                                <MenuItem value="de">German</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Theme</InputLabel>
                              <Select
                                value={profileData.preferences.theme}
                                onChange={handlePreferenceChange("theme")}
                                label="Theme"
                                sx={{ borderRadius: 2 }}
                              >
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                                <MenuItem value="auto">Auto</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Side - Statistics and Account Info */}
              <Grid item xs={12} lg={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                  {/* User Statistics */}
                  <Card sx={{ 
                    boxShadow: theme.shadows[6],
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)}, ${alpha(theme.palette.background.paper, 1)})`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[12],
                    }
                  }}>
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom color="success.main" sx={{ mb: 3 }}>
                        Parking Statistics
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`
                          }}>
                            <DirectionsCar sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                              {stats.totalParkingSessions}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Total Sessions
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`
                          }}>
                            <AccountBalanceWallet sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight={700} color="success.main">
                              ₹{stats.totalSpent}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Total Spent
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`
                          }}>
                            <History sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                            <Typography variant="h5" fontWeight={700} color="info.main">
                              {stats.averageSession}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Average Session
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.08),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`
                          }}>
                            <LocationOn sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h5" fontWeight={700} color="warning.main">
                              {stats.favoriteSlot}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              Favorite Slot
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Account Information */}
                  <Card sx={{ 
                    boxShadow: theme.shadows[6],
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.02)}, ${alpha(theme.palette.background.paper, 1)})`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[12],
                    },
                    flex: 1
                  }}>
                    <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom color="info.main" sx={{ mb: 3 }}>
                        Account Information
                      </Typography>
                      <List sx={{ p: 0 }}>
                        <ListItem sx={{ 
                          px: 0, 
                          py: 2,
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`
                        }}>
                          <ListItemIcon>
                            <CalendarToday sx={{ color: 'primary.main', fontSize: 28 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={600}>
                                Member Since
                              </Typography>
                            }
                            secondary={
                              <Typography variant="h6" color="primary.main" fontWeight={700}>
                                {new Date(profileData.joinDate).toLocaleDateString()}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ 
                          px: 0, 
                          py: 2,
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: alpha(theme.palette.success.main, 0.04),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.08)}`
                        }}>
                          <ListItemIcon>
                            <Security sx={{ color: 'success.main', fontSize: 28 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={600}>
                                Account Status
                              </Typography>
                            }
                            secondary={
                              <Typography variant="h6" color="success.main" fontWeight={700}>
                                Verified ✓
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ 
                          px: 0, 
                          py: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.info.main, 0.04),
                          border: `1px solid ${alpha(theme.palette.info.main, 0.08)}`
                        }}>
                          <ListItemIcon>
                            <Notifications sx={{ color: 'info.main', fontSize: 28 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={600}>
                                Notifications
                              </Typography>
                            }
                            secondary={
                              <Typography variant="h6" color="info.main" fontWeight={700}>
                                {profileData.preferences.notifications ? "Enabled" : "Disabled"}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Avatar Change Dialog */}
        <Dialog open={avatarDialog} onClose={() => setAvatarDialog(false)}>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Avatar customization will be available in a future update. 
              For now, your avatar is generated from your username.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAvatarDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

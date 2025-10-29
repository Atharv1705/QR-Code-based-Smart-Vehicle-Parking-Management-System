import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Container,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  LocalParking,
  Add,
  Delete,
  DirectionsCar,
  CheckCircle,
  Cancel,
  Refresh,

} from "@mui/icons-material";

const SlotCard = ({ slot, onDelete, theme }) => {
  const isAvailable = slot.isAvailable;
  
  return (
    <Fade in={true} timeout={600}>
      <Card
        sx={{
          height: "100%",
          position: "relative",
          transition: "all 0.3s ease-in-out",
          border: `2px solid ${isAvailable ? theme.palette.success.main : theme.palette.error.main}`,
          bgcolor: isAvailable 
            ? alpha(theme.palette.success.main, 0.05)
            : alpha(theme.palette.error.main, 0.05),
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
          },
          minHeight: { xs: 180, sm: 200 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ 
          p: { xs: 2, sm: 3 }, 
          textAlign: "center", 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Chip
                label={isAvailable ? "Available" : "Occupied"}
                color={isAvailable ? "success" : "error"}
                size="small"
                icon={isAvailable ? <CheckCircle /> : <Cancel />}
                sx={{ fontWeight: 600 }}
              />
              {isAvailable && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(slot.slotId)}
                  sx={{ 
                    p: 0.5,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
            
            <Avatar
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                mx: "auto",
                mb: 2,
                bgcolor: isAvailable 
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha(theme.palette.error.main, 0.1),
                color: isAvailable ? "success.main" : "error.main",
                border: `2px solid ${isAvailable ? theme.palette.success.main : theme.palette.error.main}`,
              }}
            >
              {isAvailable ? <LocalParking sx={{ fontSize: { xs: 24, sm: 28 } }} /> : <DirectionsCar sx={{ fontSize: { xs: 24, sm: 28 } }} />}
            </Avatar>
            
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Slot #{slot.slotId}
            </Typography>
          </Box>
          
          {!isAvailable && (
            <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 1 }}>
              <Typography variant="body2" color="text.primary" fontWeight={600} gutterBottom>
                {slot.plateNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Entry: {slot.entryTime ? new Date(slot.entryTime).toLocaleString() : 'N/A'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default function SlotManagement({ user, api, onNotify }) {
  const theme = useTheme();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, slotId: null });
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0 });

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/slots");
      setSlots(res.data.slots || []);
      setStats({
        total: res.data.totalSlots || 0,
        available: res.data.availableSlots?.length || 0,
        occupied: res.data.totalSlots - (res.data.availableSlots?.length || 0) || 0,
      });
    } catch (err) {
      setError("Failed to load slots");
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSlots, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const handleAddSlot = async () => {
    if (!newSlot || isNaN(parseInt(newSlot))) {
      onNotify?.({
        open: true,
        message: "Please enter a valid slot number",
        severity: "error",
      });
      return;
    }

    const slotId = parseInt(newSlot);
    if (slots.some(slot => slot.slotId === slotId)) {
      onNotify?.({
        open: true,
        message: "Slot already exists",
        severity: "error",
      });
      return;
    }

    setAdding(true);
    try {
      const res = await api.post("/slots", { id: slotId });
      if (res.data.success) {
        setNewSlot("");
        onNotify?.({
          open: true,
          message: "Slot added successfully!",
          severity: "success",
        });
        fetchSlots();
      }
    } catch (err) {
      onNotify?.({
        open: true,
        message: "Failed to add slot",
        severity: "error",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      const res = await api.delete(`/slots/${slotId}`);
      if (res.data.success) {
        onNotify?.({
          open: true,
          message: res.data.message || `Slot ${slotId} deleted successfully!`,
          severity: "success",
        });
        fetchSlots(); // Refresh the slots list
      } else {
        onNotify?.({
          open: true,
          message: res.data.message || `Failed to delete slot ${slotId}`,
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Delete slot error:", err);
      
      // Handle different types of errors
      let errorMessage = "Error deleting slot. Please try again.";
      
      if (err.response) {
        // Server responded with an error
        const { status, data } = err.response;
        
        switch (status) {
          case 403:
            errorMessage = "Access denied. You don't have permission to delete slots.";
            break;
          case 404:
            errorMessage = `Slot ${slotId} not found.`;
            break;
          case 409:
            errorMessage = data.message || `Cannot delete slot ${slotId} - it may be occupied.`;
            break;
          default:
            errorMessage = data.message || data.error || `Failed to delete slot ${slotId}`;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      onNotify?.({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
    setDeleteDialog({ open: false, slotId: null });
  };

  const confirmDelete = (slotId) => {
    setDeleteDialog({ open: true, slotId });
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
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between", 
              alignItems: "center", 
              mb: { xs: 3, sm: 4 },
              gap: 2,
              textAlign: "center"
            }}>
              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  gutterBottom 
                  sx={{ 
                    mb: 1,
                    fontSize: { xs: '1.75rem', sm: '2.125rem' }
                  }}
                >
                  Slot Management
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
                  Manage parking slots and monitor their status in real-time
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchSlots}
                disabled={loading}
                sx={{ minWidth: 120, height: 40 }}
              >
                Refresh
              </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  height: "100%"
                }}>
                  <CardContent sx={{ textAlign: "center", py: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Total Slots
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1), 
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  height: "100%"
                }}>
                  <CardContent sx={{ textAlign: "center", py: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight={700} color="success.main" sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}>
                      {stats.available}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Available
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: alpha(theme.palette.error.main, 0.1), 
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  height: "100%"
                }}>
                  <CardContent sx={{ textAlign: "center", py: { xs: 2, sm: 3 } }}>
                    <Typography variant="h3" fontWeight={700} color="error.main" sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}>
                      {stats.occupied}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Occupied
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Add New Slot */}
            <Card sx={{ mb: { xs: 2, sm: 3 }, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                  Add New Slot
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2, 
                  alignItems: { xs: "stretch", sm: "center" }
                }}>
                  <TextField
                    label="Slot Number"
                    type="number"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    size="small"
                    sx={{ 
                      minWidth: { xs: "100%", sm: 150 },
                      flex: { xs: 1, sm: "none" }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newSlot && !adding) {
                        handleAddSlot();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={adding ? <CircularProgress size={16} /> : <Add />}
                    onClick={handleAddSlot}
                    disabled={adding || !newSlot}
                    sx={{ 
                      minWidth: { xs: "100%", sm: 140 },
                      height: 40
                    }}
                  >
                    {adding ? "Adding..." : "Add Slot"}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Slots Grid */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {slots.length === 0 ? (
                  <Grid item xs={12}>
                    <Card sx={{ textAlign: "center", py: { xs: 4, sm: 8 } }}>
                      <CardContent>
                        <LocalParking sx={{ fontSize: { xs: 48, sm: 64 }, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No slots available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add your first parking slot to get started
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  slots
                    .sort((a, b) => a.slotId - b.slotId)
                    .map((slot) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={slot.slotId}>
                        <SlotCard
                          slot={slot}
                          onDelete={confirmDelete}
                          theme={theme}
                        />
                      </Grid>
                    ))
                )}
              </Grid>
            )}
          </Box>
        </Fade>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, slotId: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete Slot #{deleteDialog.slotId}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, slotId: null })}>
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteSlot(deleteDialog.slotId)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

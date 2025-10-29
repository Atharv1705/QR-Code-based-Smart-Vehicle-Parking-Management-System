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
  Stack,
} from "@mui/material";
import {
  LocalParking,
  DirectionsCar,
  CheckCircle,
  Cancel,
  Refresh,
  QrCode,
  ExitToApp,
  Login,
} from "@mui/icons-material";
import QRCodeGen from "./QRCodeGen";

const SlotCard = ({ slot, onBook, plateNumber, theme, disabled }) => {
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
          "&:hover": isAvailable ? {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
          } : {},
          opacity: disabled ? 0.6 : 1,
          minHeight: { xs: 200, sm: 220 },
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
            <Chip
              label={isAvailable ? "Available" : "Occupied"}
              color={isAvailable ? "success" : "error"}
              size="small"
              icon={isAvailable ? <CheckCircle /> : <Cancel />}
              sx={{ mb: 2, fontWeight: 600 }}
            />
            
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                bgcolor: isAvailable 
                  ? alpha(theme.palette.success.main, 0.1)
                  : alpha(theme.palette.error.main, 0.1),
                color: isAvailable ? "success.main" : "error.main",
                border: `2px solid ${isAvailable ? theme.palette.success.main : theme.palette.error.main}`,
              }}
            >
              {isAvailable ? <LocalParking sx={{ fontSize: 32 }} /> : <DirectionsCar sx={{ fontSize: 32 }} />}
            </Avatar>
            
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Slot #{slot.slotId}
            </Typography>
          </Box>
          
          {!isAvailable ? (
            <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 1 }}>
              <Typography variant="body2" color="text.primary" fontWeight={600} gutterBottom>
                {slot.plateNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Entry: {slot.entryTime ? new Date(slot.entryTime).toLocaleString() : 'N/A'}
              </Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={disabled ? <CircularProgress size={16} /> : <Login />}
              onClick={() => onBook(slot.slotId)}
              disabled={disabled || !plateNumber}
              fullWidth
              sx={{ mt: 2 }}
            >
              {disabled ? "Booking..." : "Book Slot"}
            </Button>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default function ParkingManagement({ api, onNotify }) {
  const theme = useTheme();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [booking, setBooking] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [qrDialog, setQrDialog] = useState(false);
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

  const handleBook = async (slotId) => {
    if (!plateNumber.trim()) {
      onNotify?.({
        open: true,
        message: "Please enter a valid plate number",
        severity: "error",
      });
      return;
    }

    setBooking(true);
    try {
      const res = await api.post("/book", { slotId, plate: plateNumber.trim().toUpperCase() });
      if (res.data.success) {
        onNotify?.({
          open: true,
          message: res.data.message || "Slot booked successfully!",
          severity: "success",
        });
        setPlateNumber("");
        fetchSlots();
      } else {
        onNotify?.({
          open: true,
          message: res.data.message || "Booking failed",
          severity: "error",
        });
      }
    } catch (err) {
      onNotify?.({
        open: true,
        message: "Error booking slot",
        severity: "error",
      });
    } finally {
      setBooking(false);
    }
  };

  const handleRelease = async () => {
    if (!plateNumber.trim()) {
      onNotify?.({
        open: true,
        message: "Please enter a valid plate number",
        severity: "error",
      });
      return;
    }

    setReleasing(true);
    try {
      const res = await api.post("/release", { plate: plateNumber.trim().toUpperCase() });
      if (res.data.success) {
        onNotify?.({
          open: true,
          message: res.data.message || "Vehicle released successfully!",
          severity: "success",
        });
        setPlateNumber("");
        fetchSlots();
      } else {
        onNotify?.({
          open: true,
          message: res.data.message || "Release failed",
          severity: "error",
        });
      }
    } catch (err) {
      onNotify?.({
        open: true,
        message: "Error releasing vehicle",
        severity: "error",
      });
    } finally {
      setReleasing(false);
    }
  };

  const availableSlots = slots.filter(slot => slot.isAvailable);
  const occupiedSlots = slots.filter(slot => !slot.isAvailable);

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
              alignItems: { xs: "flex-start", sm: "center" }, 
              mb: { xs: 2, sm: 3 },
              gap: 2
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
                  Parking Management
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
                  Manage vehicle entry and exit with real-time slot monitoring
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

            {/* Vehicle Management */}
            <Card sx={{ mb: 4, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Vehicle Management
                </Typography>
                <Grid container spacing={3} alignItems="end">
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Vehicle Plate Number"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                      fullWidth
                      placeholder="e.g., ABC123"
                      helperText="Enter the vehicle's license plate number"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && plateNumber.trim()) {
                          handleRelease();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack 
                      direction={{ xs: "column", sm: "row" }} 
                      spacing={2}
                      sx={{ width: "100%" }}
                    >
                      <Button
                        variant="contained"
                        startIcon={releasing ? <CircularProgress size={16} /> : <ExitToApp />}
                        onClick={handleRelease}
                        disabled={releasing || !plateNumber.trim()}
                        color="warning"
                        sx={{ minWidth: { xs: "100%", sm: 160 } }}
                      >
                        {releasing ? "Releasing..." : "Release Vehicle"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<QrCode />}
                        onClick={() => setQrDialog(true)}
                        disabled={!plateNumber.trim()}
                        sx={{ minWidth: { xs: "100%", sm: 160 } }}
                      >
                        Generate QR Code
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Slots Display */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            ) : (
              <Box>
                {/* Available Slots */}
                {availableSlots.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="success.main">
                      Available Slots ({availableSlots.length})
                    </Typography>
                    <Grid container spacing={3}>
                      {availableSlots
                        .sort((a, b) => a.slotId - b.slotId)
                        .map((slot) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={slot.slotId}>
                            <SlotCard
                              slot={slot}
                              onBook={handleBook}
                              plateNumber={plateNumber.trim()}
                              theme={theme}
                              disabled={booking}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </Box>
                )}

                {/* Occupied Slots */}
                {occupiedSlots.length > 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="error.main">
                      Occupied Slots ({occupiedSlots.length})
                    </Typography>
                    <Grid container spacing={3}>
                      {occupiedSlots
                        .sort((a, b) => a.slotId - b.slotId)
                        .map((slot) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={slot.slotId}>
                            <SlotCard
                              slot={slot}
                              onBook={handleBook}
                              plateNumber={plateNumber.trim()}
                              theme={theme}
                              disabled={true}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </Box>
                )}

                {slots.length === 0 && (
                  <Card sx={{ textAlign: "center", py: 8 }}>
                    <CardContent>
                      <LocalParking sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No parking slots available
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please add parking slots in the Slot Management section
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}
          </Box>
        </Fade>

        {/* QR Code Dialog */}
        <Dialog
          open={qrDialog}
          onClose={() => setQrDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>QR Code for {plateNumber}</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: "center", py: 2 }}>
              <QRCodeGen plateNumber={plateNumber} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

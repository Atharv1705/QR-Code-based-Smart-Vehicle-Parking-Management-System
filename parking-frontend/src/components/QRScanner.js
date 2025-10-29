import { useRef, useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Fade,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemButton,
} from "@mui/material";
import {
  QrCodeScanner,
  CheckCircle,
  Error,
  CameraAlt,
  History,
  DirectionsCar,
  LocalParking,
  Login,
  ExitToApp,

} from "@mui/icons-material";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

export default function QRScanner({ onScan, user, onNotify }) {
  const theme = useTheme();
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState("");
  const [bookingDialog, setBookingDialog] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [action, setAction] = useState("entry"); // "entry" or "exit"
  const [loading, setLoading] = useState(false);
  const [scannedPlate, setScannedPlate] = useState("");

  useEffect(() => {
    startScanner();
    fetchAvailableSlots();
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const res = await API.get("/slots");
      const available = res.data.availableSlots || [];
      setAvailableSlots(available);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const startScanner = () => {
    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
        },
        false
      );
      
      const onScanSuccess = (decodedText) => {
        setScanResult({
          text: decodedText,
          timestamp: new Date().toLocaleString(),
          success: true,
        });
        
        // Add to history
        setScanHistory(prev => [{
          text: decodedText,
          timestamp: new Date().toLocaleString(),
          id: Date.now(),
        }, ...prev.slice(0, 4)]);
        
        // Set scanned plate and open booking dialog
        setScannedPlate(decodedText.toUpperCase());
        setBookingDialog(true);
        
        if (onScan) {
          onScan(decodedText);
        }
        
        setError("");
      };
      
      const onScanError = (errorMessage) => {
        // Handle scan error silently for continuous scanning
        if (errorMessage.includes("No QR code found")) {
          return; // Normal when no QR code is in view
        }
        console.log("QR scan error:", errorMessage);
      };
      
      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
      setIsScanning(true);
      setError("");
    } catch (err) {
      setError("Failed to start camera. Please ensure camera permissions are granted.");
      console.error("Scanner error:", err);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  const restartScanner = () => {
    stopScanner();
    setTimeout(() => {
      startScanner();
    }, 100);
  };

  const handleBookSlot = async () => {
    if (!selectedSlot || !scannedPlate) {
      onNotify?.({
        open: true,
        message: "Please select a slot and ensure plate number is scanned",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/book", {
        slotId: parseInt(selectedSlot),
        plate: scannedPlate,
      });

      if (res.data.success) {
        onNotify?.({
          open: true,
          message: res.data.message || `Successfully booked slot ${selectedSlot} for ${scannedPlate}`,
          severity: "success",
        });
        setBookingDialog(false);
        setSelectedSlot("");
        fetchAvailableSlots(); // Refresh available slots
      } else {
        onNotify?.({
          open: true,
          message: res.data.message || "Failed to book slot",
          severity: "error",
        });
      }
    } catch (error) {
      onNotify?.({
        open: true,
        message: "Error booking slot. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseVehicle = async () => {
    if (!scannedPlate) {
      onNotify?.({
        open: true,
        message: "Please scan a valid plate number",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/release", {
        plate: scannedPlate,
      });

      if (res.data.success) {
        onNotify?.({
          open: true,
          message: res.data.message || `Successfully released vehicle ${scannedPlate}`,
          severity: "success",
        });
        setBookingDialog(false);
        fetchAvailableSlots(); // Refresh available slots
      } else {
        onNotify?.({
          open: true,
          message: res.data.message || "Failed to release vehicle",
          severity: "error",
        });
      }
    } catch (error) {
      onNotify?.({
        open: true,
        message: "Error releasing vehicle. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setBookingDialog(false);
    setSelectedSlot("");
    setAction("entry");
    setScannedPlate("");
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "background.default", 
      display: "flex",
      flexDirection: "column"
    }}>
      <Container maxWidth="lg" sx={{ 
        flex: 1, 
        py: { xs: 3, sm: 4 }, 
        px: { xs: 2, sm: 3 },
        pt: { xs: 10, sm: 11 }, // Account for fixed AppBar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '1200px' }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
              <Avatar
                sx={{
                  width: { xs: 64, sm: 80 },
                  height: { xs: 64, sm: 80 },
                  mx: "auto",
                  mb: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                <QrCodeScanner sx={{ fontSize: { xs: 32, sm: 40 } }} />
              </Avatar>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                QR Code Scanner
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Scan QR codes for quick vehicle entry and identification
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: { xs: 2, sm: 3, lg: 4 } }}>
              {/* Scanner Section */}
              <Card sx={{ height: "fit-content" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Camera Scanner
                    </Typography>
                    <Chip
                      icon={isScanning ? <CameraAlt /> : <Error />}
                      label={isScanning ? "Scanning..." : "Stopped"}
                      color={isScanning ? "success" : "error"}
                      variant="outlined"
                    />
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Scanner Container */}
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: alpha(theme.palette.grey[900], 0.05),
                      border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                      minHeight: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div 
                      id="qr-reader" 
                      style={{ 
                        width: "100%",
                        maxWidth: 500,
                      }} 
                    />
                    {!isScanning && (
                      <Box sx={{ textAlign: "center", p: 4 }}>
                        <CameraAlt sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Camera Not Active
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Click the button below to start scanning
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<CameraAlt />}
                          onClick={startScanner}
                        >
                          Start Camera
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Controls */}
                  <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "center" }}>
                    <Button
                      variant="outlined"
                      onClick={restartScanner}
                      disabled={!isScanning}
                    >
                      Restart Scanner
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={stopScanner}
                      disabled={!isScanning}
                    >
                      Stop Scanner
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Results and History Section */}
              <Box>
                {/* Latest Scan Result */}
                {scanResult && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Latest Scan
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          borderRadius: 1,
                          border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                        }}
                      >
                        <Typography variant="body1" fontWeight={600} gutterBottom>
                          {scanResult.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Scanned at {scanResult.timestamp}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Scan History */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <History sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="h6" fontWeight={600}>
                        Recent Scans
                      </Typography>
                    </Box>
                    
                    {scanHistory.length === 0 ? (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <QrCodeScanner sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          No scans yet. Point your camera at a QR code to start.
                        </Typography>
                      </Box>
                    ) : (
                      <List>
                        {scanHistory.map((scan, index) => (
                          <Box key={scan.id}>
                            <ListItemButton 
                              sx={{ px: 0, borderRadius: 1 }}
                              onClick={() => {
                                setScannedPlate(scan.text);
                                setBookingDialog(true);
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                  <DirectionsCar />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={scan.text}
                                secondary={scan.timestamp}
                                primaryTypographyProps={{ fontWeight: 500 }}
                              />
                            </ListItemButton>
                            {index < scanHistory.length - 1 && <Divider />}
                          </Box>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>

                {/* Manual Entry */}
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Manual Entry
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Can't scan? Enter the plate number manually
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <TextField
                        label="Plate Number"
                        size="small"
                        value={scannedPlate}
                        onChange={(e) => setScannedPlate(e.target.value.toUpperCase())}
                        placeholder="e.g., ABC123"
                        sx={{ flexGrow: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (scannedPlate.trim()) {
                            setBookingDialog(true);
                          } else {
                            onNotify?.({
                              open: true,
                              message: "Please enter a valid plate number",
                              severity: "error",
                            });
                          }
                        }}
                        disabled={!scannedPlate.trim()}
                      >
                        Process
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      How to Use
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="1. Allow camera access"
                          secondary="Grant permission when prompted"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="2. Position QR code"
                          secondary="Hold the QR code steady in the camera view"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="3. Wait for scan"
                          secondary="The system will automatically detect and process the code"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="4. Manual entry"
                          secondary="Use manual entry if QR scanning fails"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Booking Dialog */}
        <Dialog 
          open={bookingDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <QrCodeScanner sx={{ mr: 2, color: "primary.main" }} />
              QR Code Scanned: {scannedPlate}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Vehicle plate <strong>{scannedPlate}</strong> has been scanned successfully.
                What would you like to do?
              </Typography>

              <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
                <InputLabel>Action</InputLabel>
                <Select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  label="Action"
                >
                  <MenuItem value="entry">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Login sx={{ mr: 1 }} />
                      Vehicle Entry (Book Slot)
                    </Box>
                  </MenuItem>
                  <MenuItem value="exit">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ExitToApp sx={{ mr: 1 }} />
                      Vehicle Exit (Release Slot)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {action === "entry" && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Select an available parking slot:
                  </Typography>
                  
                  {availableSlots.length === 0 ? (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        No parking slots are currently available. Please try again later.
                      </Typography>
                    </Alert>
                  ) : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {availableSlots.slice(0, 12).map((slot) => (
                        <Grid item xs={4} sm={3} key={slot}>
                          <Card
                            sx={{
                              cursor: "pointer",
                              border: selectedSlot === slot.toString() ? 2 : 1,
                              borderColor: selectedSlot === slot.toString() 
                                ? "primary.main" 
                                : "divider",
                              bgcolor: selectedSlot === slot.toString() 
                                ? alpha(theme.palette.primary.main, 0.1)
                                : "background.paper",
                              "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                              },
                            }}
                            onClick={() => setSelectedSlot(slot.toString())}
                          >
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              <LocalParking 
                                sx={{ 
                                  fontSize: 24, 
                                  color: selectedSlot === slot.toString() 
                                    ? "primary.main" 
                                    : "text.secondary",
                                  mb: 1 
                                }} 
                              />
                              <Typography 
                                variant="body2" 
                                fontWeight={selectedSlot === slot.toString() ? 600 : 400}
                              >
                                Slot {slot}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {availableSlots.length > 12 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                      Showing first 12 available slots. Total available: {availableSlots.length}
                    </Typography>
                  )}
                </Box>
              )}

              {action === "exit" && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Click "Release Vehicle" to process the exit for vehicle <strong>{scannedPlate}</strong>.
                    The system will automatically find and release the occupied slot.
                  </Typography>
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancel
            </Button>
            {action === "entry" ? (
              <Button
                onClick={handleBookSlot}
                variant="contained"
                disabled={loading || !selectedSlot || availableSlots.length === 0}
                startIcon={loading ? <CircularProgress size={20} /> : <Login />}
              >
                {loading ? "Booking..." : `Book Slot ${selectedSlot || ""}`}
              </Button>
            ) : (
              <Button
                onClick={handleReleaseVehicle}
                variant="contained"
                color="warning"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <ExitToApp />}
              >
                {loading ? "Releasing..." : "Release Vehicle"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

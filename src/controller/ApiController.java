package controller;

import dto.BookingRequest;
import dto.LoginRequest;
import dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import util.JwtUtil;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private JwtUtil jwtUtil;

    // Initialize DB on startup
    public ApiController() {
        model.DatabaseManager.initialize();
        // Initialize some default slots if none exist
        initializeDefaultSlots();
    }
    
    private void initializeDefaultSlots() {
        List<Integer> existing = model.SlotDAO.getAvailableSlots();
        if (existing.isEmpty()) {
            // Add some default slots
            for (int i = 1; i <= 10; i++) {
                model.SlotDAO.addSlot(i);
            }
        }
    }

    // Register user
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request, 
                                                       BindingResult bindingResult) {
        Map<String, Object> res = new HashMap<>();
        
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            res.put("success", false);
            res.put("message", "Validation failed");
            res.put("errors", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        try {
            boolean ok = model.UserDAO.registerUser(request.getUsername(), request.getPassword(), request.getRole());
            if (ok) {
                res.put("success", true);
                res.put("message", "User registered successfully");
            } else {
                res.put("success", false);
                res.put("message", "Username already exists");
            }
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
        
        return ResponseEntity.ok(res);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request,
                                                    BindingResult bindingResult) {
        Map<String, Object> res = new HashMap<>();
        
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            res.put("success", false);
            res.put("message", "Validation failed");
            res.put("errors", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        try {
            boolean valid = model.UserDAO.validateLogin(request.getUsername(), request.getPassword());
            if (valid) {
                String role = model.UserDAO.getUserRole(request.getUsername());
                String token = jwtUtil.generateToken(request.getUsername(), role);
                
                res.put("success", true);
                res.put("user", Map.of(
                    "username", request.getUsername(),
                    "role", role
                ));
                res.put("token", token);
                res.put("message", "Login successful");
            } else {
                res.put("success", false);
                res.put("message", "Invalid username or password");
            }
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
        
        return ResponseEntity.ok(res);
    }

    // Get all slots with their status
    @GetMapping("/slots")
    public ResponseEntity<Map<String, Object>> getSlots() {
        List<Map<String, Object>> allSlots = model.SlotDAO.getAllSlotsWithStatus();
        List<Integer> availableSlots = model.SlotDAO.getAvailableSlots();
        Map<String, Object> res = new HashMap<>();
        res.put("slots", allSlots);
        res.put("availableSlots", availableSlots);
        res.put("totalSlots", allSlots.size());
        res.put("occupiedSlots", allSlots.size() - availableSlots.size());
        return ResponseEntity.ok(res);
    }

    // Add a slot
    @PostMapping("/slots")
    public ResponseEntity<Map<String, Object>> addSlot(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        try {
            Number idn = (Number) body.get("id");
            if (idn == null) {
                res.put("success", false);
                res.put("message", "id required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
            }
            int id = idn.intValue();
            model.SlotDAO.addSlot(id);
            res.put("success", true);
            return ResponseEntity.ok(res);
        } catch (ClassCastException e) {
            res.put("success", false);
            res.put("message", "invalid id");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }

    // Delete a slot
    @DeleteMapping("/slots/{id}")
    public ResponseEntity<Map<String, Object>> deleteSlot(@PathVariable int id) {
        Map<String, Object> res = new HashMap<>();
        boolean deleted = model.SlotDAO.deleteSlot(id);
        if (deleted) {
            res.put("success", true);
            res.put("message", "Slot " + id + " deleted successfully");
        } else {
            res.put("success", false);
            res.put("message", "Cannot delete slot " + id + " - it may be occupied or not exist");
        }
        return ResponseEntity.ok(res);
    }

    // Book a slot (entry)
    @PostMapping("/book")
    public ResponseEntity<Map<String, Object>> bookSlot(@Valid @RequestBody BookingRequest request,
                                                       BindingResult bindingResult) {
        Map<String, Object> res = new HashMap<>();
        
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            res.put("success", false);
            res.put("message", "Validation failed");
            res.put("errors", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        try {
            // Check if vehicle is already parked
            if (model.TransactionDAO.isVehicleCurrentlyParked(request.getPlate())) {
                res.put("success", false);
                res.put("message", "Vehicle " + request.getPlate() + " is already parked");
                return ResponseEntity.ok(res);
            }

            boolean booked = model.SlotDAO.bookSlot(request.getSlotId(), request.getPlate());
            if (booked) {
                model.TransactionDAO.logEntry(request.getPlate(), request.getSlotId());
                res.put("success", true);
                res.put("message", "Slot " + request.getSlotId() + " booked successfully for " + request.getPlate());
                res.put("slotId", request.getSlotId());
                res.put("plateNumber", request.getPlate());
            } else {
                res.put("success", false);
                res.put("message", "Slot " + request.getSlotId() + " is not available");
            }
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Booking failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
        
        return ResponseEntity.ok(res);
    }

    // Release a slot (exit)
    @PostMapping("/release")
    public ResponseEntity<Map<String, Object>> releaseSlot(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        String plate = (String) body.get("plate");
        
        if (plate == null || plate.trim().isEmpty()) {
            res.put("success", false);
            res.put("message", "Plate number is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        
        plate = plate.toUpperCase().trim();
        
        try {
            // Use the enhanced TransactionDAO method
            boolean exitLogged = model.TransactionDAO.logExit(plate);
            
            if (exitLogged) {
                // Find and release the slot
                try (Connection conn = model.DatabaseManager.getConnection()) {
                    PreparedStatement ps = conn.prepareStatement(
                        "SELECT slotId FROM transactions WHERE plateNumber=? AND exitTime IS NOT NULL ORDER BY exitTime DESC LIMIT 1"
                    );
                    ps.setString(1, plate);
                    ResultSet rs = ps.executeQuery();
                    
                    if (rs.next()) {
                        int slotId = rs.getInt("slotId");
                        boolean released = model.SlotDAO.releaseSlot(slotId);
                        
                        if (released) {
                            res.put("success", true);
                            res.put("message", "Vehicle " + plate + " released from slot " + slotId + " successfully");
                            res.put("slotId", slotId);
                        } else {
                            res.put("success", false);
                            res.put("message", "Failed to release slot " + slotId);
                        }
                    } else {
                        res.put("success", true);
                        res.put("message", "Vehicle " + plate + " exit logged successfully");
                    }
                }
            } else {
                res.put("success", false);
                res.put("message", "No active parking session found for " + plate);
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Error processing exit: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
        
        return ResponseEntity.ok(res);
    }

    // Get transaction history for plate
    @GetMapping("/history/{plate}")
    public ResponseEntity<Map<String, Object>> getHistory(@PathVariable String plate) {
        Map<String, Object> res = new HashMap<>();
        var hist = model.TransactionDAO.getHistory(plate);
        res.put("history", hist);
        res.put("count", hist.size());
        return ResponseEntity.ok(res);
    }

    // Get all transactions
    @GetMapping("/transactions")
    public ResponseEntity<Map<String, Object>> getAllTransactions() {
        Map<String, Object> res = new HashMap<>();
        var transactions = model.TransactionDAO.getAllTransactions();
        res.put("transactions", transactions);
        res.put("count", transactions.size());
        return ResponseEntity.ok(res);
    }

    // Update user profile (simple stub)
    @PostMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        // For now, just echo back
        res.put("success", true);
        res.put("profile", body);
        return ResponseEntity.ok(res);
    }

    // Download QR for a plate (returns image bytes)
    @GetMapping(value = "/qr/{plate}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQr(@PathVariable String plate) {
        try {
            // generate QR to temp file
            String tmp = System.getProperty("java.io.tmpdir") + "/" + plate + "_qr.png";
            controller.QRCodeGenerator.generateQRCode(plate, tmp, 300, 300);
            byte[] bytes = Files.readAllBytes(Paths.get(tmp));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentLength(bytes.length);
            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get analytics data
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> stats = new ArrayList<>();
        
        // Get real statistics from database
        List<Integer> availableSlots = model.SlotDAO.getAvailableSlots();
        int totalSlots = model.SlotDAO.getTotalSlots();
        int occupiedSlots = totalSlots - availableSlots.size();
        Map<String, Object> analyticsData = model.TransactionDAO.getAnalyticsData();
        
        stats.add(Map.of("label", "Available Slots", "value", availableSlots.size()));
        stats.add(Map.of("label", "Total Slots", "value", totalSlots));
        stats.add(Map.of("label", "Occupied Slots", "value", occupiedSlots));
        stats.add(Map.of("label", "Total Vehicles Today", "value", analyticsData.get("todayVehicles")));
        stats.add(Map.of("label", "Total Revenue", "value", "$" + analyticsData.get("totalRevenue")));
        stats.add(Map.of("label", "Average Duration", "value", analyticsData.get("averageDuration") + "h"));
        
        res.put("stats", stats);
        res.put("hourlyUsage", analyticsData.get("hourlyUsage"));
        res.put("vehicleTypes", analyticsData.get("vehicleTypes"));
        res.put("revenueData", analyticsData.get("revenueData"));
        
        return ResponseEntity.ok(res);
    }

    // Get/Update settings
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        Map<String, Object> res = new HashMap<>();
        // Mock settings - in real app, store in database
        Map<String, Object> settings = Map.of(
            "notifications", true,
            "darkMode", false
        );
        res.put("settings", settings);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        // Mock settings update - in real app, save to database
        res.put("success", true);
        res.put("message", "Settings updated successfully");
        return ResponseEntity.ok(res);
    }

    // Enhanced user management
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers() {
        Map<String, Object> res = new HashMap<>();
        // Mock user list - in real app, get from database
        List<Map<String, Object>> users = List.of(
            Map.of("id", 1, "username", "admin", "role", "admin", "status", "active"),
            Map.of("id", 2, "username", "user1", "role", "user", "status", "active"),
            Map.of("id", 3, "username", "user2", "role", "user", "status", "inactive")
        );
        res.put("users", users);
        return ResponseEntity.ok(res);
    }

    // Dashboard stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> res = new HashMap<>();
        List<Integer> availableSlots = model.SlotDAO.getAvailableSlots();
        int totalSlots = model.SlotDAO.getTotalSlots();
        int occupiedSlots = totalSlots - availableSlots.size();
        
        // Calculate real statistics
        Map<String, Object> todayStats = model.TransactionDAO.getTodayStatistics();
        
        res.put("totalSlots", totalSlots);
        res.put("availableSlots", availableSlots.size());
        res.put("occupiedSlots", occupiedSlots);
        res.put("occupancyRate", totalSlots > 0 ? (double) occupiedSlots / totalSlots * 100 : 0);
        res.put("todayRevenue", todayStats.get("revenue"));
        res.put("todayVehicles", todayStats.get("vehicles"));
        res.put("averageDuration", todayStats.get("averageDuration"));
        res.put("peakOccupancy", todayStats.get("peakOccupancy"));
        
        return ResponseEntity.ok(res);
    }

    // Notifications
    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>> getNotifications() {
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> notifications = List.of(
            Map.of("id", 1, "message", "Vehicle ABC123 entered", "time", "2 minutes ago", "type", "entry"),
            Map.of("id", 2, "message", "Slot 5 released", "time", "5 minutes ago", "type", "exit"),
            Map.of("id", 3, "message", "New user registered", "time", "10 minutes ago", "type", "user")
        );
        res.put("notifications", notifications);
        return ResponseEntity.ok(res);
    }
}

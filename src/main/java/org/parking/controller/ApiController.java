package org.parking.controller;

import org.parking.dto.BookingRequest;
import org.parking.dto.LoginRequest;
import org.parking.dto.RegisterRequest;
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
import org.parking.util.JwtUtil;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ApiController {

    @Autowired
    private JwtUtil jwtUtil;

    // Initialize DB on startup
    public ApiController() {
        org.parking.model.DatabaseManager.initialize();
        // Initialize some default slots if none exist
        initializeDefaultSlots();
    }
    
    // Simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> res = new HashMap<>();
        res.put("message", "API is working!");
        res.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(res);
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "UP");
        res.put("timestamp", java.time.LocalDateTime.now().toString());
        res.put("service", "Parking Management API");
        
        // Test database connection
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            res.put("database", "Connected");
            
            // Check if users table exists and has data
            PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) as count FROM users");
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                res.put("userCount", rs.getInt("count"));
            }
        } catch (Exception e) {
            res.put("database", "Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(res);
    }
    
    private void initializeDefaultSlots() {
        // First, sync slot availability with actual transactions
        syncSlotAvailability();
        
        // Then check if we need to add default slots
        List<Integer> existing = org.parking.model.SlotDAO.getAvailableSlots();
        int totalSlots = org.parking.model.SlotDAO.getTotalSlots();
        
        if (totalSlots == 0) {
            // Add some default slots if none exist at all
            for (int i = 1; i <= 10; i++) {
                org.parking.model.SlotDAO.addSlot(i);
            }
        }
    }
    
    private void syncSlotAvailability() {
        // Reset all slots to available, then mark occupied ones based on active transactions
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            // First, mark all slots as available
            PreparedStatement resetPs = conn.prepareStatement("UPDATE slots SET isAvailable = 1");
            resetPs.executeUpdate();
            
            // Then mark slots with active transactions as unavailable
            PreparedStatement occupyPs = conn.prepareStatement(
                "UPDATE slots SET isAvailable = 0 WHERE slotId IN " +
                "(SELECT DISTINCT slotId FROM transactions WHERE exitTime IS NULL)"
            );
            occupyPs.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
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
            boolean ok = org.parking.model.UserDAO.registerUser(request.getUsername(), request.getPassword(), request.getRole(), request.getEmail());
            if (ok) {
                res.put("success", true);
                res.put("message", "User registered successfully");
            } else {
                res.put("success", false);
                res.put("message", "Username or email already exists");
            }
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
        
        return ResponseEntity.ok(res);
    }

    // Login
    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
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
            boolean valid = org.parking.model.UserDAO.validateLogin(request.getUsername(), request.getPassword());
            if (valid) {
                String role = org.parking.model.UserDAO.getUserRole(request.getUsername());
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
            e.printStackTrace(); // Log the full stack trace
            res.put("success", false);
            res.put("message", "Login failed: " + e.getMessage());
            res.put("error", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
        
        return ResponseEntity.ok(res);
    }
    
    // Simple login test endpoint (for debugging)
    @PostMapping("/login-test")
    public ResponseEntity<Map<String, Object>> loginTest(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        
        try {
            String username = (String) body.get("username");
            String password = (String) body.get("password");
            
            if (username == null || password == null) {
                res.put("success", false);
                res.put("message", "Username and password are required");
                return ResponseEntity.badRequest().body(res);
            }
            
            boolean valid = org.parking.model.UserDAO.validateLogin(username, password);
            if (valid) {
                String role = org.parking.model.UserDAO.getUserRole(username);
                String token = jwtUtil.generateToken(username, role);
                
                res.put("success", true);
                res.put("user", Map.of(
                    "username", username,
                    "role", role
                ));
                res.put("token", token);
                res.put("message", "Login successful");
            } else {
                res.put("success", false);
                res.put("message", "Invalid username or password");
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.put("success", false);
            res.put("message", "Login failed: " + e.getMessage());
            res.put("error", e.getClass().getSimpleName());
        }
        
        return ResponseEntity.ok(res);
    }

    // Get all slots with their status
    @GetMapping("/slots")
    public ResponseEntity<Map<String, Object>> getSlots() {
        List<Map<String, Object>> allSlots = org.parking.model.SlotDAO.getAllSlotsWithStatus();
        List<Integer> availableSlots = org.parking.model.SlotDAO.getAvailableSlots();
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
            org.parking.model.SlotDAO.addSlot(id);
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
        
        try {
            // First check if slot exists
            Map<String, Object> slot = org.parking.model.SlotDAO.getSlotById(id);
            if (slot == null) {
                res.put("success", false);
                res.put("message", "Slot " + id + " does not exist");
                return ResponseEntity.ok(res);
            }
            
            // Check if slot is available (not occupied)
            boolean isAvailable = (Boolean) slot.get("isAvailable");
            if (!isAvailable) {
                res.put("success", false);
                res.put("message", "Cannot delete slot " + id + " - it is currently occupied by vehicle " + slot.get("plateNumber"));
                return ResponseEntity.ok(res);
            }
            
            // Attempt to delete the slot
            boolean deleted = org.parking.model.SlotDAO.deleteSlot(id);
            if (deleted) {
                res.put("success", true);
                res.put("message", "Slot " + id + " deleted successfully");
            } else {
                res.put("success", false);
                res.put("message", "Failed to delete slot " + id + " - database error occurred");
            }
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Error deleting slot " + id + ": " + e.getMessage());
            e.printStackTrace();
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
            if (org.parking.model.TransactionDAO.isVehicleCurrentlyParked(request.getPlate())) {
                res.put("success", false);
                res.put("message", "Vehicle " + request.getPlate() + " is already parked");
                return ResponseEntity.ok(res);
            }

            boolean booked = org.parking.model.SlotDAO.bookSlot(request.getSlotId(), request.getPlate());
            if (booked) {
                org.parking.model.TransactionDAO.logEntry(request.getPlate(), request.getSlotId());
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

    // Debug endpoint to check database state for a vehicle
    @GetMapping("/debug/vehicle/{plate}")
    public ResponseEntity<Map<String, Object>> debugVehicle(@PathVariable String plate) {
        Map<String, Object> res = new HashMap<>();
        plate = plate.toUpperCase().trim();
        
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            // Get all transactions for this vehicle
            PreparedStatement ps = conn.prepareStatement(
                "SELECT id, plateNumber, slotId, entryTime, exitTime FROM transactions WHERE plateNumber = ? ORDER BY entryTime DESC"
            );
            ps.setString(1, plate);
            ResultSet rs = ps.executeQuery();
            
            List<Map<String, Object>> transactions = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> transaction = new HashMap<>();
                transaction.put("id", rs.getInt("id"));
                transaction.put("plateNumber", rs.getString("plateNumber"));
                transaction.put("slotId", rs.getInt("slotId"));
                transaction.put("entryTime", rs.getString("entryTime"));
                transaction.put("exitTime", rs.getString("exitTime"));
                transaction.put("isActive", rs.getString("exitTime") == null);
                transactions.add(transaction);
            }
            
            res.put("plateNumber", plate);
            res.put("transactions", transactions);
            res.put("isCurrentlyParked", org.parking.model.TransactionDAO.isVehicleCurrentlyParked(plate));
            
        } catch (SQLException e) {
            res.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(res);
    }

    // Check vehicle status
    @GetMapping("/vehicle/{plate}/status")
    public ResponseEntity<Map<String, Object>> getVehicleStatus(@PathVariable String plate) {
        Map<String, Object> res = new HashMap<>();
        plate = plate.toUpperCase().trim();
        
        boolean isParked = org.parking.model.TransactionDAO.isVehicleCurrentlyParked(plate);
        res.put("plateNumber", plate);
        res.put("isCurrentlyParked", isParked);
        
        if (isParked) {
            // Get current parking details
            try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
                PreparedStatement ps = conn.prepareStatement(
                    "SELECT slotId, entryTime FROM transactions WHERE plateNumber=? AND exitTime IS NULL ORDER BY entryTime DESC LIMIT 1"
                );
                ps.setString(1, plate);
                ResultSet rs = ps.executeQuery();
                
                if (rs.next()) {
                    res.put("slotId", rs.getInt("slotId"));
                    res.put("entryTime", rs.getString("entryTime"));
                    res.put("message", "Vehicle is currently parked in slot " + rs.getInt("slotId"));
                }
            } catch (SQLException e) {
                res.put("message", "Error retrieving parking details");
            }
        } else {
            res.put("message", "Vehicle is not currently parked");
        }
        
        return ResponseEntity.ok(res);
    }

    // Debug: Test database and create test user
    @PostMapping("/debug/create-test-user")
    public ResponseEntity<Map<String, Object>> createTestUser() {
        Map<String, Object> res = new HashMap<>();
        
        try {
            // First test database connection
            try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
                // Test if users table exists
                PreparedStatement testPs = conn.prepareStatement("SELECT COUNT(*) FROM users");
                testPs.executeQuery();
                res.put("databaseConnected", true);
            }
            
            // Try to create a test user
            boolean created = org.parking.model.UserDAO.registerUser("admin", "Admin123!", "admin");
            if (created) {
                res.put("success", true);
                res.put("message", "Test admin user created successfully");
                res.put("username", "admin");
                res.put("password", "Admin123!");
            } else {
                res.put("success", false);
                res.put("message", "Test user already exists or creation failed");
            }
            
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", "Database error: " + e.getMessage());
            res.put("databaseConnected", false);
        }
        
        return ResponseEntity.ok(res);
    }

    // Debug: List all users (admin function)
    @GetMapping("/debug/users")
    public ResponseEntity<Map<String, Object>> listUsers() {
        Map<String, Object> res = new HashMap<>();
        
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT username, role, created_at, is_active FROM users");
            ResultSet rs = ps.executeQuery();
            
            List<Map<String, Object>> users = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> user = new HashMap<>();
                user.put("username", rs.getString("username"));
                user.put("role", rs.getString("role"));
                user.put("created_at", rs.getString("created_at"));
                user.put("is_active", rs.getBoolean("is_active"));
                users.add(user);
            }
            
            res.put("success", true);
            res.put("users", users);
            res.put("count", users.size());
            
        } catch (SQLException e) {
            res.put("success", false);
            res.put("message", "Error retrieving users: " + e.getMessage());
        }
        
        return ResponseEntity.ok(res);
    }

    // Simple reset all data (admin function)
    @PostMapping("/debug/reset-all")
    public ResponseEntity<Map<String, Object>> resetAllData() {
        Map<String, Object> res = new HashMap<>();
        
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            // Clear all transactions
            PreparedStatement clearTransactions = conn.prepareStatement("DELETE FROM transactions");
            int deletedTransactions = clearTransactions.executeUpdate();
            
            // Reset all slots to available
            PreparedStatement resetSlotsPs = conn.prepareStatement("UPDATE slots SET isAvailable = 1");
            int resetSlotsCount = resetSlotsPs.executeUpdate();
            
            res.put("success", true);
            res.put("message", "All data reset successfully");
            res.put("deletedTransactions", deletedTransactions);
            res.put("resetSlots", resetSlotsCount);
            
        } catch (SQLException e) {
            res.put("success", false);
            res.put("message", "Error during reset: " + e.getMessage());
        }
        
        return ResponseEntity.ok(res);
    }

    // Force release specific vehicle (admin function)
    @PostMapping("/debug/force-release/{plate}")
    public ResponseEntity<Map<String, Object>> forceReleaseVehicle(@PathVariable String plate) {
        Map<String, Object> res = new HashMap<>();
        plate = plate.toUpperCase().trim();
        
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            // Find all active transactions for this vehicle
            PreparedStatement findPs = conn.prepareStatement(
                "SELECT id, slotId FROM transactions WHERE plateNumber = ? AND exitTime IS NULL"
            );
            findPs.setString(1, plate);
            ResultSet rs = findPs.executeQuery();
            
            int releasedSlots = 0;
            while (rs.next()) {
                int transactionId = rs.getInt("id");
                int slotId = rs.getInt("slotId");
                
                // Close the transaction
                PreparedStatement closePs = conn.prepareStatement(
                    "UPDATE transactions SET exitTime = ?, payment_status = 'completed' WHERE id = ?"
                );
                closePs.setString(1, java.time.LocalDateTime.now().toString());
                closePs.setInt(2, transactionId);
                closePs.executeUpdate();
                
                // Release the slot
                PreparedStatement releasePs = conn.prepareStatement("UPDATE slots SET isAvailable = 1 WHERE slotId = ?");
                releasePs.setInt(1, slotId);
                releasePs.executeUpdate();
                
                releasedSlots++;
            }
            
            if (releasedSlots > 0) {
                res.put("success", true);
                res.put("message", "Force released " + plate + " from " + releasedSlots + " slot(s)");
                res.put("releasedSlots", releasedSlots);
            } else {
                res.put("success", false);
                res.put("message", "No active parking sessions found for " + plate);
            }
            
        } catch (SQLException e) {
            res.put("success", false);
            res.put("message", "Error during force release: " + e.getMessage());
        }
        
        return ResponseEntity.ok(res);
    }

    // Fix data inconsistency for a vehicle (admin function)
    @PostMapping("/debug/fix-vehicle/{plate}")
    public ResponseEntity<Map<String, Object>> fixVehicleInconsistency(@PathVariable String plate) {
        Map<String, Object> res = new HashMap<>();
        plate = plate.toUpperCase().trim();
        
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            // Get all active transactions for this vehicle
            PreparedStatement ps = conn.prepareStatement(
                "SELECT id, slotId, entryTime FROM transactions WHERE plateNumber = ? AND exitTime IS NULL ORDER BY entryTime DESC"
            );
            ps.setString(1, plate);
            ResultSet rs = ps.executeQuery();
            
            List<Map<String, Object>> activeTransactions = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> transaction = new HashMap<>();
                transaction.put("id", rs.getInt("id"));
                transaction.put("slotId", rs.getInt("slotId"));
                transaction.put("entryTime", rs.getString("entryTime"));
                activeTransactions.add(transaction);
            }
            
            if (activeTransactions.size() > 1) {
                // Keep the most recent transaction, close the others
                for (int i = 1; i < activeTransactions.size(); i++) {
                    int transactionId = (Integer) activeTransactions.get(i).get("id");
                    int slotId = (Integer) activeTransactions.get(i).get("slotId");
                    
                    // Close the older transaction
                    PreparedStatement updatePs = conn.prepareStatement(
                        "UPDATE transactions SET exitTime = ?, duration_minutes = 0, cost = 0, payment_status = 'cancelled' WHERE id = ?"
                    );
                    updatePs.setString(1, java.time.LocalDateTime.now().toString());
                    updatePs.setInt(2, transactionId);
                    updatePs.executeUpdate();
                    
                    // Release the slot
                    org.parking.model.SlotDAO.releaseSlot(slotId);
                }
                
                res.put("success", true);
                res.put("message", "Fixed inconsistency for " + plate + ". Kept most recent session, closed " + (activeTransactions.size() - 1) + " duplicate sessions.");
                res.put("activeTransactionsBefore", activeTransactions.size());
                res.put("activeTransactionsAfter", 1);
            } else if (activeTransactions.size() == 1) {
                res.put("success", true);
                res.put("message", "No inconsistency found for " + plate + ". Vehicle has exactly one active session.");
            } else {
                res.put("success", false);
                res.put("message", "No active parking sessions found for " + plate);
            }
            
        } catch (SQLException e) {
            res.put("success", false);
            res.put("message", "Error fixing inconsistency: " + e.getMessage());
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
            // Direct database approach to handle the release
            try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
                // Find active transactions for this vehicle
                PreparedStatement findPs = conn.prepareStatement(
                    "SELECT id, slotId FROM transactions WHERE plateNumber = ? AND exitTime IS NULL"
                );
                findPs.setString(1, plate);
                ResultSet rs = findPs.executeQuery();
                
                if (!rs.next()) {
                    res.put("success", false);
                    res.put("message", "No active parking session found for " + plate + ". Vehicle needs to be checked in first.");
                    return ResponseEntity.ok(res);
                }
                
                // Get the first active transaction
                int transactionId = rs.getInt("id");
                int slotId = rs.getInt("slotId");
                
                // Close the transaction
                PreparedStatement updatePs = conn.prepareStatement(
                    "UPDATE transactions SET exitTime = ?, duration_minutes = 0, cost = 0, payment_status = 'completed' WHERE id = ?"
                );
                updatePs.setString(1, java.time.LocalDateTime.now().toString());
                updatePs.setInt(2, transactionId);
                updatePs.executeUpdate();
                
                // Release the slot
                PreparedStatement releasePs = conn.prepareStatement("UPDATE slots SET isAvailable = 1 WHERE slotId = ?");
                releasePs.setInt(1, slotId);
                releasePs.executeUpdate();
                
                res.put("success", true);
                res.put("message", "Vehicle " + plate + " released from slot " + slotId + " successfully");
                res.put("slotId", slotId);
                return ResponseEntity.ok(res);
            } catch (SQLException e) {
                // If direct approach fails, fall back to original method
                e.printStackTrace();
            }
            
            // Fallback to original method
            boolean exitLogged = org.parking.model.TransactionDAO.logExit(plate);
            
            if (exitLogged) {
                // Find and release the slot
                try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
                    PreparedStatement ps = conn.prepareStatement(
                        "SELECT slotId FROM transactions WHERE plateNumber=? AND exitTime IS NOT NULL ORDER BY exitTime DESC LIMIT 1"
                    );
                    ps.setString(1, plate);
                    ResultSet rs = ps.executeQuery();
                    
                    if (rs.next()) {
                        int slotId = rs.getInt("slotId");
                        boolean released = org.parking.model.SlotDAO.releaseSlot(slotId);
                        
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
        var hist = org.parking.model.TransactionDAO.getHistory(plate);
        res.put("history", hist);
        res.put("count", hist.size());
        return ResponseEntity.ok(res);
    }

    // Get all transactions
    @GetMapping("/transactions")
    public ResponseEntity<Map<String, Object>> getAllTransactions() {
        Map<String, Object> res = new HashMap<>();
        var transactions = org.parking.model.TransactionDAO.getAllTransactions();
        res.put("transactions", transactions);
        res.put("count", transactions.size());
        return ResponseEntity.ok(res);
    }

    // Get user profile
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        Map<String, Object> res = new HashMap<>();
        
        // Get current user from security context (if authenticated)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            String username = auth.getName();
            Map<String, Object> userProfile = org.parking.model.UserDAO.getUserProfile(username);
            
            if (!userProfile.isEmpty()) {
                res.putAll(userProfile);
                res.put("success", true);
            } else {
                res.put("success", false);
                res.put("message", "User profile not found");
            }
        } else {
            // Return default profile for anonymous users
            res.put("username", "Guest");
            res.put("role", "user");
            res.put("email", "guest@example.com");
            res.put("success", true);
        }
        
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
        List<Integer> availableSlots = org.parking.model.SlotDAO.getAvailableSlots();
        int totalSlots = org.parking.model.SlotDAO.getTotalSlots();
        int occupiedSlots = totalSlots - availableSlots.size();
        Map<String, Object> analyticsData = org.parking.model.TransactionDAO.getAnalyticsData();
        
        stats.add(Map.of("label", "Available Slots", "value", availableSlots.size()));
        stats.add(Map.of("label", "Total Slots", "value", totalSlots));
        stats.add(Map.of("label", "Occupied Slots", "value", occupiedSlots));
        stats.add(Map.of("label", "Total Vehicles Today", "value", analyticsData.get("todayVehicles")));
        stats.add(Map.of("label", "Total Revenue", "value", "₹" + analyticsData.get("totalRevenue")));
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
        List<Integer> availableSlots = org.parking.model.SlotDAO.getAvailableSlots();
        int totalSlots = org.parking.model.SlotDAO.getTotalSlots();
        int occupiedSlots = totalSlots - availableSlots.size();
        
        // Calculate real statistics
        Map<String, Object> todayStats = org.parking.model.TransactionDAO.getTodayStatistics();
        
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

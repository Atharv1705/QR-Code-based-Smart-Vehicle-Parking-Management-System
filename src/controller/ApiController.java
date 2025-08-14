package controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ApiController {
    // Example login endpoint
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        // TODO: Replace with real authentication logic
        Map<String, Object> res = new HashMap<>();
        if ("admin".equals(username) && "admin".equals(password)) {
            res.put("success", true);
            res.put("user", Map.of("username", username, "email", "admin@example.com"));
        } else {
            res.put("success", false);
        }
        return ResponseEntity.ok(res);
    }

    // Example: Get all slots
    @GetMapping("/slots")
    public List<Map<String, Object>> getSlots() {
        // TODO: Replace with real slot data
        return List.of(
            Map.of("slotId", 1, "available", true),
            Map.of("slotId", 2, "available", false)
        );
    }

    // Example: Book a slot
    @PostMapping("/book")
    public ResponseEntity<?> bookSlot(@RequestBody Map<String, Object> body) {
        // TODO: Implement booking logic
        return ResponseEntity.ok(Map.of("success", true));
    }

    // Example: Release a slot
    @PostMapping("/release")
    public ResponseEntity<?> releaseSlot(@RequestBody Map<String, Object> body) {
        // TODO: Implement release logic
        return ResponseEntity.ok(Map.of("success", true));
    }

    // Example: Get transaction history
    @GetMapping("/history/{plate}")
    public List<Map<String, Object>> getHistory(@PathVariable String plate) {
        // TODO: Replace with real history data
        return List.of(
            Map.of("slotId", 1, "entryTime", "2025-08-13T10:00", "exitTime", "2025-08-13T12:00")
        );
    }

    // Example: Update user profile
    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        // TODO: Implement profile update logic
        return ResponseEntity.ok(Map.of("success", true));
    }
}

package org.parking.model;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SlotDAO {
    public static List<Integer> getAvailableSlots() {
        List<Integer> slots = new ArrayList<>();
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT slotId FROM slots WHERE isAvailable=1 ORDER BY slotId");
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                slots.add(rs.getInt("slotId"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return slots;
    }

    public static List<Map<String, Object>> getAllSlotsWithStatus() {
        List<Map<String, Object>> slots = new ArrayList<>();
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            String query = """
                SELECT s.slotId, s.isAvailable, t.plateNumber, t.entryTime 
                FROM slots s 
                LEFT JOIN transactions t ON s.slotId = t.slotId AND t.exitTime IS NULL 
                ORDER BY s.slotId
            """;
            PreparedStatement ps = conn.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> slot = new HashMap<>();
                slot.put("slotId", rs.getInt("slotId"));
                slot.put("isAvailable", rs.getInt("isAvailable") == 1);
                slot.put("plateNumber", rs.getString("plateNumber"));
                slot.put("entryTime", rs.getString("entryTime"));
                slots.add(slot);
            }
            System.out.println("getAllSlotsWithStatus returned " + slots.size() + " slots");
        } catch (SQLException e) {
            System.err.println("Error in getAllSlotsWithStatus: " + e.getMessage());
            e.printStackTrace();
        }
        return slots;
    }

    public static int getTotalSlots() {
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM slots");
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static boolean bookSlot(int slotId, String plateNumber) {
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("UPDATE slots SET isAvailable=0 WHERE slotId=? AND isAvailable=1");
            ps.setInt(1, slotId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean releaseSlot(int slotId) {
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("UPDATE slots SET isAvailable=1 WHERE slotId=?");
            ps.setInt(1, slotId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            return false;
        }
    }

    public static void addSlot(int slotId) {
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("INSERT OR IGNORE INTO slots (slotId, isAvailable, created_at) VALUES (?, 1, ?)");
            ps.setInt(1, slotId);
            ps.setString(2, java.time.LocalDateTime.now().toString());
            int result = ps.executeUpdate();
            System.out.println("Added slot " + slotId + ", rows affected: " + result);
        } catch (SQLException e) {
            System.err.println("Error adding slot " + slotId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static boolean deleteSlot(int slotId) {
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            // First check if slot is available
            PreparedStatement checkPs = conn.prepareStatement("SELECT isAvailable FROM slots WHERE slotId=?");
            checkPs.setInt(1, slotId);
            ResultSet rs = checkPs.executeQuery();
            
            if (rs.next() && rs.getInt("isAvailable") == 1) {
                PreparedStatement deletePs = conn.prepareStatement("DELETE FROM slots WHERE slotId=?");
                deletePs.setInt(1, slotId);
                return deletePs.executeUpdate() > 0;
            }
            return false; // Cannot delete occupied slot
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static Map<String, Object> getSlotById(int slotId) {
        try (Connection conn = org.parking.model.DatabaseManager.getConnection()) {
            String query = """
                SELECT s.slotId, s.isAvailable, t.plateNumber, t.entryTime 
                FROM slots s 
                LEFT JOIN transactions t ON s.slotId = t.slotId AND t.exitTime IS NULL 
                WHERE s.slotId = ?
            """;
            PreparedStatement ps = conn.prepareStatement(query);
            ps.setInt(1, slotId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                Map<String, Object> slot = new HashMap<>();
                slot.put("slotId", rs.getInt("slotId"));
                slot.put("isAvailable", rs.getInt("isAvailable") == 1);
                slot.put("plateNumber", rs.getString("plateNumber"));
                slot.put("entryTime", rs.getString("entryTime"));
                return slot;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
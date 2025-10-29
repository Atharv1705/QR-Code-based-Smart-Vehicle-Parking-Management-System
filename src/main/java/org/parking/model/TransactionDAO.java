package org.parking.model;

import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TransactionDAO {
    public static void logEntry(String plateNumber, int slotId) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO transactions (plateNumber, slotId, entryTime, created_at) VALUES (?, ?, ?, ?)"
            );
            String now = LocalDateTime.now().toString();
            ps.setString(1, plateNumber.toUpperCase().trim());
            ps.setInt(2, slotId);
            ps.setString(3, now);
            ps.setString(4, now);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static boolean isVehicleCurrentlyParked(String plateNumber) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "SELECT COUNT(*) FROM transactions WHERE plateNumber = ? AND exitTime IS NULL"
            );
            ps.setString(1, plateNumber.toUpperCase().trim());
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static boolean logExit(String plateNumber) {
        try (Connection conn = DatabaseManager.getConnection()) {
            // First get the entry time to calculate duration and cost
            PreparedStatement getEntryPs = conn.prepareStatement(
                "SELECT id, entryTime, slotId FROM transactions WHERE plateNumber=? AND exitTime IS NULL ORDER BY entryTime DESC LIMIT 1"
            );
            getEntryPs.setString(1, plateNumber.toUpperCase().trim());
            ResultSet rs = getEntryPs.executeQuery();
            
            if (rs.next()) {
                int transactionId = rs.getInt("id");
                String entryTimeStr = rs.getString("entryTime");
                int slotId = rs.getInt("slotId");
                
                LocalDateTime entryTime = LocalDateTime.parse(entryTimeStr);
                LocalDateTime exitTime = LocalDateTime.now();
                long durationMinutes = ChronoUnit.MINUTES.between(entryTime, exitTime);
                double cost = calculateCost(durationMinutes);
                
                // Update the transaction with exit details
                PreparedStatement updatePs = conn.prepareStatement(
                    "UPDATE transactions SET exitTime=?, duration_minutes=?, cost=?, payment_status='completed' WHERE id=?"
                );
                updatePs.setString(1, exitTime.toString());
                updatePs.setLong(2, durationMinutes);
                updatePs.setDouble(3, cost);
                updatePs.setInt(4, transactionId);
                
                return updatePs.executeUpdate() > 0;
            }
            return false;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static List<Map<String, Object>> getHistory(String plateNumber) {
        List<Map<String, Object>> history = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "SELECT * FROM transactions WHERE plateNumber=? ORDER BY entryTime DESC"
            );
            ps.setString(1, plateNumber);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> transaction = new HashMap<>();
                transaction.put("id", rs.getInt("id"));
                transaction.put("plateNumber", rs.getString("plateNumber"));
                transaction.put("slotId", rs.getInt("slotId"));
                transaction.put("entryTime", rs.getString("entryTime"));
                transaction.put("exitTime", rs.getString("exitTime"));
                
                // Calculate duration if exit time exists
                String entryTime = rs.getString("entryTime");
                String exitTime = rs.getString("exitTime");
                if (entryTime != null && exitTime != null) {
                    try {
                        LocalDateTime entry = LocalDateTime.parse(entryTime);
                        LocalDateTime exit = LocalDateTime.parse(exitTime);
                        long minutes = ChronoUnit.MINUTES.between(entry, exit);
                        transaction.put("duration", formatDuration(minutes));
                        transaction.put("cost", calculateCost(minutes));
                    } catch (Exception e) {
                        transaction.put("duration", "N/A");
                        transaction.put("cost", 0.0);
                    }
                } else {
                    transaction.put("duration", "Ongoing");
                    transaction.put("cost", 0.0);
                }
                
                history.add(transaction);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return history;
    }

    public static List<Map<String, Object>> getAllTransactions() {
        List<Map<String, Object>> transactions = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "SELECT * FROM transactions ORDER BY entryTime DESC LIMIT 100"
            );
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> transaction = new HashMap<>();
                transaction.put("id", rs.getInt("id"));
                transaction.put("plateNumber", rs.getString("plateNumber"));
                transaction.put("slotId", rs.getInt("slotId"));
                transaction.put("entryTime", rs.getString("entryTime"));
                transaction.put("exitTime", rs.getString("exitTime"));
                
                String entryTime = rs.getString("entryTime");
                String exitTime = rs.getString("exitTime");
                if (entryTime != null && exitTime != null) {
                    try {
                        LocalDateTime entry = LocalDateTime.parse(entryTime);
                        LocalDateTime exit = LocalDateTime.parse(exitTime);
                        long minutes = ChronoUnit.MINUTES.between(entry, exit);
                        transaction.put("duration", formatDuration(minutes));
                        transaction.put("cost", calculateCost(minutes));
                    } catch (Exception e) {
                        transaction.put("duration", "N/A");
                        transaction.put("cost", 0.0);
                    }
                } else {
                    transaction.put("duration", "Ongoing");
                    transaction.put("cost", 0.0);
                }
                
                transactions.add(transaction);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return transactions;
    }

    public static Map<String, Object> getTodayStatistics() {
        Map<String, Object> stats = new HashMap<>();
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        
        try (Connection conn = DatabaseManager.getConnection()) {
            // Today's vehicles count
            PreparedStatement ps1 = conn.prepareStatement(
                "SELECT COUNT(DISTINCT plateNumber) as count FROM transactions WHERE entryTime >= ?"
            );
            ps1.setString(1, today.toString());
            ResultSet rs1 = ps1.executeQuery();
            int todayVehicles = rs1.next() ? rs1.getInt("count") : 0;
            
            // Today's revenue
            PreparedStatement ps2 = conn.prepareStatement(
                "SELECT entryTime, exitTime FROM transactions WHERE entryTime >= ? AND exitTime IS NOT NULL"
            );
            ps2.setString(1, today.toString());
            ResultSet rs2 = ps2.executeQuery();
            
            double totalRevenue = 0;
            long totalMinutes = 0;
            int completedTransactions = 0;
            
            while (rs2.next()) {
                try {
                    LocalDateTime entry = LocalDateTime.parse(rs2.getString("entryTime"));
                    LocalDateTime exit = LocalDateTime.parse(rs2.getString("exitTime"));
                    long minutes = ChronoUnit.MINUTES.between(entry, exit);
                    totalRevenue += calculateCost(minutes);
                    totalMinutes += minutes;
                    completedTransactions++;
                } catch (Exception e) {
                    // Skip invalid entries
                }
            }
            
            stats.put("vehicles", todayVehicles);
            stats.put("revenue", Math.round(totalRevenue * 100.0) / 100.0);
            stats.put("averageDuration", completedTransactions > 0 ? 
                formatDuration(totalMinutes / completedTransactions) : "0h 0m");
            
            // Calculate peak occupancy (simplified)
            int currentOccupied = SlotDAO.getTotalSlots() - SlotDAO.getAvailableSlots().size();
            int totalSlots = SlotDAO.getTotalSlots();
            double peakOccupancy = totalSlots > 0 ? (double) currentOccupied / totalSlots * 100 : 0;
            stats.put("peakOccupancy", Math.round(peakOccupancy) + "%");
            
        } catch (SQLException e) {
            e.printStackTrace();
            stats.put("vehicles", 0);
            stats.put("revenue", 0.0);
            stats.put("averageDuration", "0h 0m");
            stats.put("peakOccupancy", "0%");
        }
        
        return stats;
    }

    public static Map<String, Object> getAnalyticsData() {
        Map<String, Object> analytics = new HashMap<>();
        
        try (Connection conn = DatabaseManager.getConnection()) {
            // Today's statistics
            Map<String, Object> todayStats = getTodayStatistics();
            analytics.put("todayVehicles", todayStats.get("vehicles"));
            analytics.put("averageDuration", ((String) todayStats.get("averageDuration")).replace("h", "").replace("m", "").trim().split(" ")[0]);
            
            // Total revenue (all time)
            PreparedStatement ps = conn.prepareStatement(
                "SELECT entryTime, exitTime FROM transactions WHERE exitTime IS NOT NULL"
            );
            ResultSet rs = ps.executeQuery();
            
            double totalRevenue = 0;
            while (rs.next()) {
                try {
                    LocalDateTime entry = LocalDateTime.parse(rs.getString("entryTime"));
                    LocalDateTime exit = LocalDateTime.parse(rs.getString("exitTime"));
                    long minutes = ChronoUnit.MINUTES.between(entry, exit);
                    totalRevenue += calculateCost(minutes);
                } catch (Exception e) {
                    // Skip invalid entries
                }
            }
            
            analytics.put("totalRevenue", Math.round(totalRevenue));
            
            // Mock hourly usage (in real app, calculate from actual data)
            List<Map<String, Object>> hourlyUsage = new ArrayList<>();
            hourlyUsage.add(Map.of("label", "6 AM - 9 AM", "value", 15));
            hourlyUsage.add(Map.of("label", "9 AM - 12 PM", "value", 25));
            hourlyUsage.add(Map.of("label", "12 PM - 3 PM", "value", 20));
            hourlyUsage.add(Map.of("label", "3 PM - 6 PM", "value", 30));
            hourlyUsage.add(Map.of("label", "6 PM - 9 PM", "value", 22));
            hourlyUsage.add(Map.of("label", "9 PM - 12 AM", "value", 8));
            analytics.put("hourlyUsage", hourlyUsage);
            
            // Mock vehicle types
            List<Map<String, Object>> vehicleTypes = new ArrayList<>();
            vehicleTypes.add(Map.of("label", "Sedans", "value", 45));
            vehicleTypes.add(Map.of("label", "SUVs", "value", 32));
            vehicleTypes.add(Map.of("label", "Trucks", "value", 15));
            vehicleTypes.add(Map.of("label", "Motorcycles", "value", 8));
            analytics.put("vehicleTypes", vehicleTypes);
            
            // Revenue data
            List<Map<String, Object>> revenueData = new ArrayList<>();
            revenueData.add(Map.of("period", "Today", "amount", todayStats.get("revenue"), "change", "+12%"));
            revenueData.add(Map.of("period", "This Week", "amount", (Double) todayStats.get("revenue") * 7, "change", "+8%"));
            revenueData.add(Map.of("period", "This Month", "amount", (Double) todayStats.get("revenue") * 30, "change", "+15%"));
            analytics.put("revenueData", revenueData);
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return analytics;
    }

    private static String formatDuration(long minutes) {
        long hours = minutes / 60;
        long mins = minutes % 60;
        return hours + "h " + mins + "m";
    }

    private static double calculateCost(long minutes) {
        // ₹50 per hour, minimum ₹25
        double hours = Math.max(1, Math.ceil(minutes / 60.0));
        return Math.max(25.0, hours * 50.0);
    }
}

package model;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TransactionDAO {
    public static void logEntry(String plateNumber, int slotId) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("INSERT INTO transactions (plateNumber, slotId, entryTime) VALUES (?, ?, ?)");
            ps.setString(1, plateNumber);
            ps.setInt(2, slotId);
            ps.setString(3, LocalDateTime.now().toString());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void logExit(String plateNumber) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("UPDATE transactions SET exitTime=? WHERE plateNumber=? AND exitTime IS NULL");
            ps.setString(1, LocalDateTime.now().toString());
            ps.setString(2, plateNumber);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static List<String> getHistory(String plateNumber) {
        List<String> history = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM transactions WHERE plateNumber=?");
            ps.setString(1, plateNumber);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                String entry = "Slot: " + rs.getInt("slotId") + ", Entry: " + rs.getString("entryTime") + ", Exit: " + rs.getString("exitTime");
                history.add(entry);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return history;
    }
}

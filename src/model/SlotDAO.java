package model;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SlotDAO {
    public static List<Integer> getAvailableSlots() {
        List<Integer> slots = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT slotId FROM slots WHERE isAvailable=1");
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                slots.add(rs.getInt("slotId"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return slots;
    }

    public static boolean bookSlot(int slotId) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("UPDATE slots SET isAvailable=0 WHERE slotId=? AND isAvailable=1");
            ps.setInt(1, slotId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            return false;
        }
    }

    public static boolean releaseSlot(int slotId) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("UPDATE slots SET isAvailable=1 WHERE slotId=?");
            ps.setInt(1, slotId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            return false;
        }
    }

    public static void addSlot(int slotId) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("INSERT OR IGNORE INTO slots (slotId, isAvailable) VALUES (?, 1)");
            ps.setInt(1, slotId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

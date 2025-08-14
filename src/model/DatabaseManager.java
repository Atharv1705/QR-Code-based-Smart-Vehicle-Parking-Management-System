package model;

import java.sql.*;

public class DatabaseManager {
    private static final String DB_URL = "jdbc:sqlite:parking_system.db";

    public static void initialize() {
        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            Statement stmt = conn.createStatement();
            // Users table
            stmt.execute("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, role TEXT)");
            // Vehicles table
            stmt.execute("CREATE TABLE IF NOT EXISTS vehicles (plateNumber TEXT PRIMARY KEY, ownerUsername TEXT, FOREIGN KEY(ownerUsername) REFERENCES users(username))");
            // Parking slots table
            stmt.execute("CREATE TABLE IF NOT EXISTS slots (slotId INTEGER PRIMARY KEY, isAvailable INTEGER)");
            // Transactions table
            stmt.execute("CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, plateNumber TEXT, slotId INTEGER, entryTime TEXT, exitTime TEXT)");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }
}

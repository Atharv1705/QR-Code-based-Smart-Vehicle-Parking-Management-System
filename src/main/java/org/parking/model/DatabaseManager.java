package org.parking.model;

import java.sql.*;

public class DatabaseManager {
    private static final String DB_URL = "jdbc:sqlite:parking_system.db";

    public static void initialize() {
        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            Statement stmt = conn.createStatement();
            
            // Enable foreign keys
            stmt.execute("PRAGMA foreign_keys = ON");
            
            // Enhanced Users table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    username TEXT PRIMARY KEY,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'user',
                    email TEXT UNIQUE,
                    created_at TEXT NOT NULL,
                    last_login TEXT,
                    is_active BOOLEAN DEFAULT true,
                    password_changed_at TEXT,
                    failed_login_attempts INTEGER DEFAULT 0,
                    locked_until TEXT
                )
            """);
            
            // Enhanced Vehicles table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS vehicles (
                    plateNumber TEXT PRIMARY KEY,
                    ownerUsername TEXT,
                    vehicleType TEXT DEFAULT 'car',
                    color TEXT,
                    model TEXT,
                    created_at TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT true,
                    FOREIGN KEY(ownerUsername) REFERENCES users(username) ON DELETE CASCADE
                )
            """);
            
            // Enhanced Parking slots table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS slots (
                    slotId INTEGER PRIMARY KEY,
                    isAvailable INTEGER NOT NULL DEFAULT 1,
                    slotType TEXT DEFAULT 'regular',
                    hourlyRate REAL DEFAULT 2.0,
                    created_at TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT true
                )
            """);
            
            // Enhanced Transactions table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    plateNumber TEXT NOT NULL,
                    slotId INTEGER NOT NULL,
                    entryTime TEXT NOT NULL,
                    exitTime TEXT,
                    duration_minutes INTEGER,
                    cost REAL,
                    payment_status TEXT DEFAULT 'pending',
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(plateNumber) REFERENCES vehicles(plateNumber),
                    FOREIGN KEY(slotId) REFERENCES slots(slotId)
                )
            """);
            
            // Audit log table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS audit_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    action TEXT NOT NULL,
                    resource TEXT,
                    resource_id TEXT,
                    old_values TEXT,
                    new_values TEXT,
                    ip_address TEXT,
                    user_agent TEXT,
                    timestamp TEXT NOT NULL,
                    FOREIGN KEY(username) REFERENCES users(username)
                )
            """);
            
            // System settings table
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS system_settings (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    description TEXT,
                    updated_at TEXT NOT NULL,
                    updated_by TEXT,
                    FOREIGN KEY(updated_by) REFERENCES users(username)
                )
            """);
            
            // Create indexes for better performance
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_transactions_plate ON transactions(plateNumber)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_transactions_slot ON transactions(slotId)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_transactions_entry ON transactions(entryTime)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp)");
            stmt.execute("CREATE INDEX IF NOT EXISTS idx_audit_log_username ON audit_log(username)");
            
            // Insert default system settings
            insertDefaultSettings(stmt);
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    private static void insertDefaultSettings(Statement stmt) throws SQLException {
        String timestamp = java.time.LocalDateTime.now().toString();
        
        stmt.execute(String.format(
            "INSERT OR IGNORE INTO system_settings (key, value, description, updated_at) VALUES " +
            "('default_hourly_rate', '50.0', 'Default hourly parking rate in INR', '%s'), " +
            "('max_parking_duration', '24', 'Maximum parking duration in hours', '%s'), " +
            "('grace_period_minutes', '15', 'Grace period for parking in minutes', '%s'), " +
            "('system_timezone', 'UTC', 'System timezone', '%s')",
            timestamp, timestamp, timestamp, timestamp
        ));
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }
}

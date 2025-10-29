package org.parking.model;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UserDAO {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public static boolean registerUser(String username, String password, String role) {
        return registerUser(username, password, role, null);
    }

    public static boolean registerUser(String username, String password, String role, String email) {
        // Check if username already exists
        if (userExists(username)) {
            return false;
        }

        // Check if email already exists (if provided)
        if (email != null && emailExists(email)) {
            return false;
        }

        try (Connection conn = DatabaseManager.getConnection()) {
            String hashed = encoder.encode(password);
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO users (username, password, role, email, created_at, is_active) VALUES (?, ?, ?, ?, ?, ?)"
            );
            ps.setString(1, username.toLowerCase().trim());
            ps.setString(2, hashed);
            ps.setString(3, role);
            ps.setString(4, email);
            ps.setString(5, LocalDateTime.now().toString());
            ps.setBoolean(6, true);
            ps.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean validateLogin(String username, String password) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "SELECT password, is_active FROM users WHERE username=?"
            );
            ps.setString(1, username.toLowerCase().trim());
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                boolean isActive = rs.getBoolean("is_active");
                if (!isActive) {
                    return false; // Account is deactivated
                }
                
                String storedHash = rs.getString("password");
                boolean isValid = encoder.matches(password, storedHash);
                
                if (isValid) {
                    updateLastLogin(username);
                }
                
                return isValid;
            }
            return false;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static String getUserRole(String username) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT role FROM users WHERE username=?");
            ps.setString(1, username.toLowerCase().trim());
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return rs.getString("role");
            }
            return "user"; // default role
        } catch (SQLException e) {
            e.printStackTrace();
            return "user";
        }
    }

    public static Map<String, Object> getUserProfile(String username) {
        Map<String, Object> profile = new HashMap<>();
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "SELECT username, role, created_at, last_login, is_active FROM users WHERE username=?"
            );
            ps.setString(1, username.toLowerCase().trim());
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                profile.put("username", rs.getString("username"));
                profile.put("role", rs.getString("role"));
                profile.put("createdAt", rs.getString("created_at"));
                profile.put("lastLogin", rs.getString("last_login"));
                profile.put("isActive", rs.getBoolean("is_active"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return profile;
    }

    public static boolean updateUserProfile(String username, Map<String, Object> updates) {
        try (Connection conn = DatabaseManager.getConnection()) {
            StringBuilder query = new StringBuilder("UPDATE users SET ");
            boolean first = true;
            
            for (String key : updates.keySet()) {
                if (!first) query.append(", ");
                query.append(key).append(" = ?");
                first = false;
            }
            query.append(" WHERE username = ?");
            
            PreparedStatement ps = conn.prepareStatement(query.toString());
            int index = 1;
            for (Object value : updates.values()) {
                ps.setObject(index++, value);
            }
            ps.setString(index, username.toLowerCase().trim());
            
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean changePassword(String username, String oldPassword, String newPassword) {
        if (!validateLogin(username, oldPassword)) {
            return false;
        }
        
        try (Connection conn = DatabaseManager.getConnection()) {
            String hashedNewPassword = encoder.encode(newPassword);
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE users SET password = ?, password_changed_at = ? WHERE username = ?"
            );
            ps.setString(1, hashedNewPassword);
            ps.setString(2, LocalDateTime.now().toString());
            ps.setString(3, username.toLowerCase().trim());
            
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private static boolean userExists(String username) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM users WHERE username=?");
            ps.setString(1, username.toLowerCase().trim());
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private static boolean emailExists(String email) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) FROM users WHERE email=?");
            ps.setString(1, email.toLowerCase().trim());
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private static void updateLastLogin(String username) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE users SET last_login = ? WHERE username = ?"
            );
            ps.setString(1, LocalDateTime.now().toString());
            ps.setString(2, username.toLowerCase().trim());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static boolean deactivateUser(String username) {
        try (Connection conn = DatabaseManager.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "UPDATE users SET is_active = false WHERE username = ?"
            );
            ps.setString(1, username.toLowerCase().trim());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}

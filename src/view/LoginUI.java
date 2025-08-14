package view;

import java.awt.*;
import java.awt.event.ActionEvent;
import javax.swing.*;
import model.DatabaseManager;
import model.UserDAO;

public class LoginUI extends JFrame {
    private JTextField usernameField;
    private JPasswordField passwordField;
    private JButton loginBtn, registerBtn;
    private JLabel statusLabel;

    public LoginUI() {
        setTitle("Login - Parking Management");
        setSize(350, 200);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new GridLayout(5, 1));

        usernameField = new JTextField();
        passwordField = new JPasswordField();
        loginBtn = new JButton("Login");
        registerBtn = new JButton("Register");
        statusLabel = new JLabel("", SwingConstants.CENTER);

        add(new JLabel("Username:"));
        add(usernameField);
        add(new JLabel("Password:"));
        add(passwordField);
        JPanel btnPanel = new JPanel();
        btnPanel.add(loginBtn);
        btnPanel.add(registerBtn);
        add(btnPanel);
        add(statusLabel);

        loginBtn.addActionListener((ActionEvent e) -> {
            String user = usernameField.getText().trim();
            String pass = new String(passwordField.getPassword());
            if (UserDAO.validateLogin(user, pass)) {
                statusLabel.setText("Login successful!");
                dispose();
                ParkingManagementUI.main(null);
            } else {
                statusLabel.setText("Invalid credentials.");
            }
        });

        registerBtn.addActionListener((ActionEvent e) -> {
            String user = usernameField.getText().trim();
            String pass = new String(passwordField.getPassword());
            if (UserDAO.registerUser(user, pass, "owner")) {
                statusLabel.setText("Registration successful!");
            } else {
                statusLabel.setText("Registration failed.");
            }
        });
    }

    public static void main(String[] args) {
        DatabaseManager.initialize();
        SwingUtilities.invokeLater(() -> new LoginUI().setVisible(true));
    }
}

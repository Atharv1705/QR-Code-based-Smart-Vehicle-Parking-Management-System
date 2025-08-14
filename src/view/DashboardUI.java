package view;

import javax.swing.*;
import java.awt.*;

public class DashboardUI extends JFrame {
    public DashboardUI() {
        setTitle("Parking Management Dashboard");
        setSize(450, 350);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        JPanel mainPanel = new JPanel(new GridLayout(5, 1, 15, 15));
        mainPanel.setBackground(new Color(245, 250, 255));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(30, 60, 30, 60));

        Font btnFont = new Font("Segoe UI", Font.BOLD, 18);
        Color btnBg = new Color(33, 150, 243);
        Color btnFg = Color.WHITE;

        JButton parkingBtn = new JButton("Parking Management");
        JButton slotBtn = new JButton("Slot Management");
        JButton historyBtn = new JButton("Transaction History");
        JButton logoutBtn = new JButton("Logout");
        JButton exitBtn = new JButton("Exit");

        JButton[] buttons = {parkingBtn, slotBtn, historyBtn, logoutBtn, exitBtn};
        for (JButton btn : buttons) {
            btn.setFont(btnFont);
            btn.setBackground(btnBg);
            btn.setForeground(btnFg);
            btn.setFocusPainted(false);
            btn.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(21, 101, 192), 2),
                BorderFactory.createEmptyBorder(8, 20, 8, 20)));
            mainPanel.add(btn);
        }

        add(mainPanel, BorderLayout.CENTER);

        parkingBtn.addActionListener(e -> new ParkingManagementUI().setVisible(true));
        slotBtn.addActionListener(e -> new SlotManagementUI().setVisible(true));
        historyBtn.addActionListener(e -> new TransactionHistoryUI().setVisible(true));
        logoutBtn.addActionListener(e -> {
            dispose();
            LoginUI.main(null);
        });
        exitBtn.addActionListener(e -> System.exit(0));
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new DashboardUI().setVisible(true));
    }
}

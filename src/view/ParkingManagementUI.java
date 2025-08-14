package view;

import controller.QRCodeGenerator;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.*;
import model.SlotDAO;
import model.TransactionDAO;

public class ParkingManagementUI extends JFrame {
    private JTextField plateField;
    private JLabel qrLabel;
    private JTextArea statusArea;
    private JButton generateBtn, scanBtn, exitBtn;
    private JFileChooser fileChooser;

    public ParkingManagementUI() {
        setTitle("Smart Vehicle Parking Management");
        setSize(600, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        JPanel inputPanel = new JPanel();
        inputPanel.add(new JLabel("Vehicle Plate Number:"));
        plateField = new JTextField(15);
        inputPanel.add(plateField);
        generateBtn = new JButton("Generate QR Code");
        inputPanel.add(generateBtn);
        scanBtn = new JButton("Scan QR Code (Entry)");
        inputPanel.add(scanBtn);
        exitBtn = new JButton("Vehicle Exit");
        inputPanel.add(exitBtn);
        add(inputPanel, BorderLayout.NORTH);

        qrLabel = new JLabel();
        qrLabel.setHorizontalAlignment(JLabel.CENTER);
        add(qrLabel, BorderLayout.CENTER);

        statusArea = new JTextArea(5, 40);
        statusArea.setEditable(false);
        add(new JScrollPane(statusArea), BorderLayout.SOUTH);

        fileChooser = new JFileChooser();

        generateBtn.addActionListener(e -> {
            String plate = plateField.getText().trim();
            if (plate.isEmpty()) {
                JOptionPane.showMessageDialog(ParkingManagementUI.this, "Enter plate number.");
                return;
            }
            String filePath = "qr_" + plate + ".png";
            try {
                QRCodeGenerator.generateQRCode(plate, filePath, 300, 300);
                BufferedImage img = ImageIO.read(new File(filePath));
                qrLabel.setIcon(new ImageIcon(img));
                statusArea.setText("QR code generated and saved as " + filePath);
            } catch (Exception ex) {
                statusArea.setText("Error: " + ex.getMessage());
            }
        });

        scanBtn.addActionListener(e -> {
            int result = fileChooser.showOpenDialog(ParkingManagementUI.this);
            if (result == JFileChooser.APPROVE_OPTION) {
                File file = fileChooser.getSelectedFile();
                try {
                    String decoded = QRCodeGenerator.readQRCode(file.getAbsolutePath());
                    // Book first available slot
                    java.util.List<Integer> available = SlotDAO.getAvailableSlots();
                    if (!available.isEmpty()) {
                        int slotId = available.get(0);
                        if (SlotDAO.bookSlot(slotId)) {
                            TransactionDAO.logEntry(decoded, slotId);
                            statusArea.setText("Vehicle " + decoded + " entered. Slot " + slotId + " booked.");
                        } else {
                            statusArea.setText("Failed to book slot for vehicle " + decoded);
                        }
                    } else {
                        statusArea.setText("No available slots for vehicle " + decoded);
                    }
                } catch (Exception ex) {
                    statusArea.setText("Error: " + ex.getMessage());
                }
            }
        });

        exitBtn.addActionListener(e -> {
            String plate = plateField.getText().trim();
            if (plate.isEmpty()) {
                statusArea.setText("Enter plate number for exit.");
                return;
            }
            // Find the last slot used by this vehicle (from transaction history)
            java.util.List<String> history = model.TransactionDAO.getHistory(plate);
            if (!history.isEmpty()) {
                // Parse slotId from last entry
                String last = history.get(history.size() - 1);
                String[] parts = last.split(",");
                int slotId = -1;
                for (String part : parts) {
                    if (part.trim().startsWith("Slot:")) {
                        try {
                            slotId = Integer.parseInt(part.replace("Slot:", "").trim());
                        } catch (NumberFormatException ignore) {}
                    }
                }
                if (slotId != -1) {
                    if (SlotDAO.releaseSlot(slotId)) {
                        TransactionDAO.logExit(plate);
                        statusArea.setText("Vehicle " + plate + " exited. Slot " + slotId + " released.");
                    } else {
                        statusArea.setText("Failed to release slot for vehicle " + plate);
                    }
                } else {
                    statusArea.setText("Could not determine slot for vehicle " + plate);
                }
            } else {
                statusArea.setText("No entry record found for vehicle " + plate);
            }
        });
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new ParkingManagementUI().setVisible(true));
    }
}

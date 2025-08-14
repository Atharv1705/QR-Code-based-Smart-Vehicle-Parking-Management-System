package view;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.util.List;
import javax.swing.*;
import model.SlotDAO;

public class SlotManagementUI extends JFrame {
    private DefaultListModel<Integer> slotListModel;
    private JList<Integer> slotList;
    private JButton bookBtn, releaseBtn, refreshBtn;
    private JTextField slotIdField;
    private JLabel statusLabel;

    public SlotManagementUI() {
        setTitle("Parking Slot Management");
        setSize(400, 350);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        slotListModel = new DefaultListModel<>();
        slotList = new JList<>(slotListModel);
        JScrollPane scrollPane = new JScrollPane(slotList);
        add(scrollPane, BorderLayout.CENTER);

        JPanel controlPanel = new JPanel();
        controlPanel.add(new JLabel("Slot ID:"));
        slotIdField = new JTextField(5);
        controlPanel.add(slotIdField);
        bookBtn = new JButton("Book Slot");
        releaseBtn = new JButton("Release Slot");
        refreshBtn = new JButton("Refresh");
        controlPanel.add(bookBtn);
        controlPanel.add(releaseBtn);
        controlPanel.add(refreshBtn);
        add(controlPanel, BorderLayout.NORTH);

        statusLabel = new JLabel("", SwingConstants.CENTER);
        add(statusLabel, BorderLayout.SOUTH);

        refreshBtn.addActionListener((ActionEvent e) -> refreshSlots());
        bookBtn.addActionListener((ActionEvent e) -> {
            try {
                int slotId = Integer.parseInt(slotIdField.getText().trim());
                if (SlotDAO.bookSlot(slotId)) {
                    statusLabel.setText("Slot " + slotId + " booked.");
                } else {
                    statusLabel.setText("Booking failed or slot unavailable.");
                }
                refreshSlots();
            } catch (NumberFormatException ex) {
                statusLabel.setText("Invalid slot ID.");
            }
        });
        releaseBtn.addActionListener((ActionEvent e) -> {
            try {
                int slotId = Integer.parseInt(slotIdField.getText().trim());
                if (SlotDAO.releaseSlot(slotId)) {
                    statusLabel.setText("Slot " + slotId + " released.");
                } else {
                    statusLabel.setText("Release failed.");
                }
                refreshSlots();
            } catch (NumberFormatException ex) {
                statusLabel.setText("Invalid slot ID.");
            }
        });
        refreshSlots();
    }

    private void refreshSlots() {
        slotListModel.clear();
        List<Integer> slots = SlotDAO.getAvailableSlots();
        for (Integer slot : slots) {
            slotListModel.addElement(slot);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new SlotManagementUI().setVisible(true));
    }
}

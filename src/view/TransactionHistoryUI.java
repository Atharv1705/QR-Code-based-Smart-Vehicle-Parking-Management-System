package view;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.util.List;
import javax.swing.*;
import model.TransactionDAO;

public class TransactionHistoryUI extends JFrame {
    private JTextField plateField;
    private JButton fetchBtn;
    private JTextArea historyArea;

    public TransactionHistoryUI() {
        setTitle("Transaction History");
        setSize(400, 350);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        JPanel topPanel = new JPanel();
        topPanel.add(new JLabel("Plate Number:"));
        plateField = new JTextField(10);
        topPanel.add(plateField);
        fetchBtn = new JButton("Fetch History");
        topPanel.add(fetchBtn);
        add(topPanel, BorderLayout.NORTH);

        historyArea = new JTextArea();
        historyArea.setEditable(false);
        add(new JScrollPane(historyArea), BorderLayout.CENTER);

        fetchBtn.addActionListener((ActionEvent e) -> {
            String plate = plateField.getText().trim();
            if (plate.isEmpty()) {
                historyArea.setText("Enter a plate number.");
                return;
            }
            List<String> history = TransactionDAO.getHistory(plate);
            if (history.isEmpty()) {
                historyArea.setText("No history found for this vehicle.");
            } else {
                StringBuilder sb = new StringBuilder();
                for (String entry : history) {
                    sb.append(entry).append("\n");
                }
                historyArea.setText(sb.toString());
            }
        });
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new TransactionHistoryUI().setVisible(true));
    }
}

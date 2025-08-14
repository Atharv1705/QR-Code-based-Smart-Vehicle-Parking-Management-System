import controller.QRCodeGenerator;
import model.User;
import model.Vehicle;
import model.ParkingSlot;

public class Main {
    public static void main(String[] args) {
        // Example usage
        User user = new User("john", "password123", "owner");
        Vehicle vehicle = new Vehicle("ABC123", user.getUsername());
        ParkingSlot slot = new ParkingSlot(1, true);
        
        // Generate QR code for vehicle entry
        try {
            QRCodeGenerator.generateQRCode(vehicle.getPlateNumber(), "vehicle_qr.png");
            System.out.println("QR Code generated for vehicle: " + vehicle.getPlateNumber());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

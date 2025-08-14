package model;

public class Vehicle {
    private String plateNumber;
    private String ownerUsername;

    public Vehicle(String plateNumber, String ownerUsername) {
        this.plateNumber = plateNumber;
        this.ownerUsername = ownerUsername;
    }

    // Getters and setters
    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
}

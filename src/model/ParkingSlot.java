package model;

public class ParkingSlot {
    private int slotId;
    private boolean isAvailable;

    public ParkingSlot(int slotId, boolean isAvailable) {
        this.slotId = slotId;
        this.isAvailable = isAvailable;
    }

    // Getters and setters
    public int getSlotId() { return slotId; }
    public void setSlotId(int slotId) { this.slotId = slotId; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
}

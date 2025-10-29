package org.parking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public class BookingRequest {
    @NotBlank(message = "Plate number is required")
    @Pattern(regexp = "^[A-Z0-9]{2,10}$", message = "Plate number must be 2-10 characters, uppercase letters and numbers only")
    private String plate;

    @NotNull(message = "Slot ID is required")
    @Positive(message = "Slot ID must be positive")
    private Integer slotId;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(String plate, Integer slotId) {
        this.plate = plate;
        this.slotId = slotId;
    }

    // Getters and setters
    public String getPlate() { return plate; }
    public void setPlate(String plate) { this.plate = plate; }
    public Integer getSlotId() { return slotId; }
    public void setSlotId(Integer slotId) { this.slotId = slotId; }
}
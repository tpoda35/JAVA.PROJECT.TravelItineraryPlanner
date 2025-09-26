package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class TripDayAccommodation {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Accommodation name cannot be empty.")
    @Column(length = 150, nullable = false)
    private String name;

    @NotBlank(message = "Address cannot be empty.")
    @Column(length = 250, nullable = false)
    private String address;

    @NotNull(message = "Check-in date cannot be empty.")
    private ZonedDateTime checkIn;

    @NotNull(message = "Check-out date cannot be empty.")
    private ZonedDateTime checkOut;

    private String notes; // optional extra information

    @ManyToOne
    @JoinColumn(name = "tripDay_id")
    @JsonIgnore
    private TripDay tripDay;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private ZonedDateTime updatedAt;

    // Optional validation: ensure checkOut is after checkIn
    @Transient
    public boolean isValidDates() {
        return checkIn != null && checkOut != null && checkOut.isAfter(checkIn);
    }
}

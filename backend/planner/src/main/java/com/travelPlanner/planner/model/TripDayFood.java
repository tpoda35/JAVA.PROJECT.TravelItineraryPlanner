package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.travelPlanner.planner.enums.MealType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;

import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class TripDayFood {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Food name cannot be empty.")
    @Length(max = 150, message = "Food name cannot exceed 150 characters.")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Start time cannot be null.") // Time, because the user will only set the time.
    private ZonedDateTime startDate;

    @NotNull(message = "End time cannot be null.") // Time, because the user will only set the time.
    private ZonedDateTime endDate;

    @Column(length = 500)
    private String notes;

    @Column(length = 250)
    private String location;

    @Enumerated(EnumType.STRING)
    private MealType mealType;

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

    @Transient
    public void validateDates() {
        if (startDate != null && endDate != null && !endDate.isAfter(startDate)) {
            throw new IllegalArgumentException("End date/time must be after start date/time for food: " + name);
        }
    }

}

package com.travelPlanner.planner.model;

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

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Activity {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Destination field cannot be empty.")
    @Length(min = 1, max = 150, message = "Destination field must be between 1 and 150.")
    private String title;

    private String description;

    @NotNull(message = "Start date field cannot be empty.")
    private LocalDate startDate;

    @NotNull(message = "End date field cannot be empty.")
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "tripDay_id")
    private TripDay tripDay;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}

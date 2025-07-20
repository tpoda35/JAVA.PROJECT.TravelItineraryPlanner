package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Activity {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Title field cannot be empty.")
    @Length(min = 1, max = 150, message = "Title field must be between 1 and 150.")
    @EqualsAndHashCode.Include
    private String title;

    private String description;

    @NotNull(message = "Start date field cannot be empty.")
    @EqualsAndHashCode.Include
    private LocalDateTime startDate;

    @NotNull(message = "End date field cannot be empty.")
    private LocalDateTime endDate;

    @ManyToOne
    @JoinColumn(name = "tripDay_id")
    @JsonIgnore
    @EqualsAndHashCode.Include
    private TripDay tripDay;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}

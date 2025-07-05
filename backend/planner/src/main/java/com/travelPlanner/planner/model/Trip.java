package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Trip {

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank(message = "Name field cannot be empty.")
    @Length(min = 1, max = 100, message = "Name field must be between 1 and 100.")
    @EqualsAndHashCode.Include
    private String name;

    @NotBlank(message = "Destination field cannot be empty.")
    @Length(min = 1, max = 150, message = "Destination field must be between 1 and 150.")
    @EqualsAndHashCode.Include
    private String destination;

    @NotNull(message = "Start date field cannot be empty.")
    @EqualsAndHashCode.Include
    private LocalDate startDate;

    @NotNull(message = "End date field cannot be empty.")
    @EqualsAndHashCode.Include
    private LocalDate endDate;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private Set<TripDay> tripDays = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "folder_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Folder folder;

    private boolean cooperativeEditingEnabled;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Trip {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Name field cannot be empty.")
    @Length(min = 1, max = 100, message = "Name field must be between 1 and 100.")
    private String name;

    @NotBlank(message = "Destination field cannot be empty.")
    @Length(min = 1, max = 150, message = "Destination field must be between 1 and 150.")
    private String destination;

    @NotNull(message = "Start date field cannot be empty.")
    private LocalDate startDate;

    @NotNull(message = "End date field cannot be empty.")
    private LocalDate endDate;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<Day> days = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "folder_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Folder folder;

    @ManyToOne
    @JoinColumn(name = "appUser_id")
    @JsonIgnore
    @ToString.Exclude
    private AppUser appUser;
}

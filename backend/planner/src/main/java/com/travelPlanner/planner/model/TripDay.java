package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.DayOfWeek;
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
public class TripDay {

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;

    @EqualsAndHashCode.Include
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Include
    private DayOfWeek day;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonIgnore
    @ToString.Exclude
    private Trip trip;

    @OneToMany(mappedBy = "tripDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<Activity> activities = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

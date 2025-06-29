package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class TripDay {

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek day;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonIgnore
    @ToString.Exclude
    private Trip trip;

    @OneToMany(mappedBy = "tripDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<Activity> activities = new ArrayList<>();
}

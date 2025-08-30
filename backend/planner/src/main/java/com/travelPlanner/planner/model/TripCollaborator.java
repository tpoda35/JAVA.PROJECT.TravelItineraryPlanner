package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.travelPlanner.planner.Enum.CollaboratorRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"trip_id", "collaborator_id"})
})
public class TripCollaborator {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "collaborator_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private AppUser collaborator;

    @Enumerated(EnumType.STRING)
    @NotNull
    private CollaboratorRole role;

    @CreationTimestamp
    @Column(nullable = false)
    private ZonedDateTime joinedAt;
}
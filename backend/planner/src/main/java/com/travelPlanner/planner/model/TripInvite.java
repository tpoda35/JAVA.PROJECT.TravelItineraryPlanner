package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.travelPlanner.planner.Enum.InviteStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"trip_id", "invitee_id"})
})
public class TripInvite {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "inviter_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private AppUser inviter;

    @ManyToOne
    @JoinColumn(name = "invitee_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private AppUser invitee;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "status")
    private InviteStatus status;

    private LocalDateTime expiresAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
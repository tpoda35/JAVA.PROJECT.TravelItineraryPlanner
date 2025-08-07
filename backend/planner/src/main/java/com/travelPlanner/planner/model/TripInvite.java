package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.travelPlanner.planner.Enum.InviteStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
        @UniqueConstraint(columnNames = {"trip_id", "invitee_username"})
})
public class TripInvite {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Trip name cannot be empty.")
    private String tripName; // This is an email.

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Trip trip;

    @NotBlank(message = "Invitee username cannot be empty.")
    @Column(name = "inviter_username")
    private String inviterUsername; // This is an email.

    @ManyToOne
    @JoinColumn(name = "inviter_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private AppUser inviter;

    @NotBlank(message = "Invitee username cannot be empty.")
    @Column(name = "invitee_username")
    private String inviteeUsername; // This is an email.

    @ManyToOne
    @JoinColumn(name = "invitee_id")
    @JsonIgnore
    @ToString.Exclude
    private AppUser invitee;

    @Enumerated(EnumType.STRING)
    @NotNull
    private InviteStatus status;

    private LocalDateTime expiresAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
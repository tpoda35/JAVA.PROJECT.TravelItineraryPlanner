package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.travelPlanner.planner.enums.SubscriptionPlan;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "app_user",
        indexes = {
                @Index(name = "idx_app_user_username", columnList = "username", unique = true)
        }
)
public class AppUser {

    @Id
    private String id;

    @Column(name = "username", nullable = false, unique = true)
    private String username; // This is the email

    @OneToMany(mappedBy = "appUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<Folder> folders = new ArrayList<>();

    // Invite and collaboration
    @OneToMany(mappedBy = "inviter", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<TripInvite> sentInvites = new ArrayList<>();

    @OneToMany(mappedBy = "invitee", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<TripInvite> receivedInvites = new ArrayList<>();

    @OneToMany(mappedBy = "collaborator", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<TripCollaborator> collaborations = new ArrayList<>();
    // ----

    @Enumerated(EnumType.STRING)
    private SubscriptionPlan subscriptionPlan;

    @PrePersist
    public void prePersist() {
        subscriptionPlan = SubscriptionPlan.FREE;
    }
}

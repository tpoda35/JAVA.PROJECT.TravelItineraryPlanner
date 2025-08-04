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
    private List<TripDay> tripDays = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "folder_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Folder folder;

    // Trip collaboration
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<TripInvite> invites = new ArrayList<>();

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<TripCollaborator> collaborators = new ArrayList<>();
    // ----

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

//    public AppUser getOwner() {
//        return collaborators.stream()
//                .filter(c -> c.getRole() == OWNER)
//                .map(TripCollaborator::getCollaborator)
//                .findFirst()
//                .orElse(folder.getAppUser());
//    }
//
//    public boolean isOwner(AppUser user) {
//        return collaborators.stream()
//                .anyMatch(c -> c.getCollaborator().equals(user) && c.getRole() == OWNER);
//    }
//
//    public boolean isCollaborator(AppUser user) {
//        return collaborators.stream()
//                .anyMatch(c -> c.getCollaborator().equals(user));
//    }
//
//    public boolean canEdit(AppUser user) {
//        return isOwner(user) ||
//                (isCollaborator(user));
//    }
}

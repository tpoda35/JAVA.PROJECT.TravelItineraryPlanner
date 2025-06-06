package com.travelPlanner.planner.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Folder {

    @Id
    @GeneratedValue
    private Long id;

    @NotBlank(message = "Name field cannot be empty.")
    private String name;

    @NotNull(message = "Start date field cannot be empty.")
    private boolean isDefault = false;

    @NotNull(message = "Start date field cannot be empty.")
    private boolean isDeletable = true;

    @ManyToOne
    @JoinColumn(name = "appUser_id", nullable = false)
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "parent_folder_id")
    private Folder parentFolder; // Later

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    private List<Trip> trips = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

}

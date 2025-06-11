package com.travelPlanner.planner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
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

    private boolean isDefault = false;
    private boolean isDeletable = true;

    @ManyToOne
    @JoinColumn(name = "appUser_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private AppUser appUser;

//    @ManyToOne
//    @JoinColumn(name = "parent_folder_id")
//    @JsonIgnore
//    @ToString.Exclude
//    private Folder parentFolder;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<Trip> trips = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

}

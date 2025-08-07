package com.travelPlanner.planner.dto.invite;

import com.travelPlanner.planner.Enum.InviteStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripInviteDetailsDtoV1 implements Serializable {

    private Long id;
    private String tripName;
    private String inviterUsername;
    private String inviteeUsername;

    @Enumerated(EnumType.STRING)
    private InviteStatus status;
    private LocalDateTime expiresAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

}

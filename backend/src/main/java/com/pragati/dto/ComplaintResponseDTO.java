package com.pragati.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponseDTO {
    private Long id;
    private String complaintToken;
    private String title;
    private String description;
    private String category;
    private String location;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private String status;
    private Integer escalationLevel;
    private Boolean canEscalateToVibhag;
    private Boolean canEscalateToBDO;
    private LocalDateTime bdoEscalationTime;
    private LocalDateTime createdAt;
    private String userFullName;
    private String blockchainTxnId;
    private String blockchainHash;
    private Integer supportCount;
    private Boolean isSupportedByCurrentUser;
}

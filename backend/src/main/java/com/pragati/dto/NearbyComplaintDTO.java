package com.pragati.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NearbyComplaintDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String location;
    private Double latitude;
    private Double longitude;
    private Double distance;
    private String status;
    private String imageUrl;
    private LocalDateTime createdAt;
}

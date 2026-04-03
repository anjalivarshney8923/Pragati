package com.pragati.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeocodingResponseDTO {
    private Double latitude;
    private Double longitude;
    private String displayName;
}

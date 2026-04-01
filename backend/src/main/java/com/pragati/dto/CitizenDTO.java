package com.pragati.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitizenDTO {
    private Long id;
    private String name;
    private String mobile;
    private String location; // village/district
    private String maskedAadhaar; // XXXX-XXXX-1234
    private String status; // VERIFIED / PENDING
}

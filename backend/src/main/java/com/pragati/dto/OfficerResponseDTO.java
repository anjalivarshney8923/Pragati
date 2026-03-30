package com.pragati.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfficerResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String employeeId;
    private String role;
    private String status;
    private String token;
}

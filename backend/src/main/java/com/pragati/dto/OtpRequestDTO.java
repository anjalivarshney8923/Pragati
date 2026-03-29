package com.pragati.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpRequestDTO {
    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;
}

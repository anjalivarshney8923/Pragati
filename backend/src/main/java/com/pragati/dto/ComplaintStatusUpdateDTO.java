package com.pragati.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ComplaintStatusUpdateDTO {
    @NotBlank(message = "Status is required")
    private String status;
}

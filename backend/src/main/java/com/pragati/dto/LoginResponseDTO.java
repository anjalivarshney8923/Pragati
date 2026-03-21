package com.pragati.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private boolean success;
    private String message;
    private String token;
    private UserDTO user;
}

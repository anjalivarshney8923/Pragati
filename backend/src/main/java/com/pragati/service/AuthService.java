package com.pragati.service;

import com.pragati.dto.LoginRequestDTO;
import com.pragati.dto.LoginResponseDTO;
import com.pragati.dto.RegisterRequestDTO;
import com.pragati.dto.RegisterResponseDTO;

public interface AuthService {
    RegisterResponseDTO registerUser(RegisterRequestDTO request);
    LoginResponseDTO loginUser(LoginRequestDTO request);

    // AI Integration placeholders
    boolean verifyAadhaar(String aadhaarNumber);
    boolean verifyFace(Object faceData);
    boolean verifyAge(String dob);
}

package com.pragati.controller;

import com.pragati.dto.LoginRequestDTO;
import com.pragati.dto.LoginResponseDTO;
import com.pragati.dto.RegisterRequestDTO;
import com.pragati.dto.RegisterResponseDTO;
import com.pragati.dto.OtpRequestDTO;
import com.pragati.dto.OtpVerifyDTO;
import com.pragati.service.AuthService;
import com.pragati.service.OtpService;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        RegisterResponseDTO response = authService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.loginUser(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody OtpRequestDTO request) {
        otpService.generateAndSendOtp(request.getMobileNumber());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody OtpVerifyDTO request) {
        boolean isValid = otpService.verifyOtp(request.getMobileNumber(), request.getOtp());
        
        Map<String, String> response = new HashMap<>();
        if (isValid) {
            response.put("message", "OTP verified successfully.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid or expired OTP.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}

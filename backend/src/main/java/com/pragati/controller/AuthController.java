package com.pragati.controller;

import com.pragati.dto.*;
import com.pragati.service.AuthService;
import com.pragati.service.OfficerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OfficerService officerService;

    // --- Villager Authentication ---
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

    // --- Officer Authentication (Restricted) ---
    @PostMapping(value = "/register-officer", consumes = "multipart/form-data")
    public ResponseEntity<OfficerResponseDTO> registerOfficer(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("mobile") String mobileNumber,
            @RequestParam("employeeId") String employeeId,
            @RequestParam("password") String password,
            @RequestParam("department") String department,
            @RequestParam("designation") String designation,
            @RequestParam("state") String state,
            @RequestParam("district") String district,
            @RequestParam("govtIdFile") MultipartFile govtIdFile,
            @RequestParam("appointmentLetterFile") MultipartFile appointmentLetterFile
    ) {
        OfficerResponseDTO response = officerService.registerOfficer(
                fullName, email, mobileNumber, employeeId, password, department, 
                designation, state, district, govtIdFile, appointmentLetterFile
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login-officer")
    public ResponseEntity<OfficerResponseDTO> loginOfficer(@Valid @RequestBody OfficerLoginRequest request) {
        OfficerResponseDTO response = officerService.loginOfficer(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

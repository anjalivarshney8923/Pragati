package com.pragati.service;

import com.pragati.dto.*;
import com.pragati.entity.Officer;
import com.pragati.entity.OfficerRole;
import com.pragati.entity.OfficerStatus;
import com.pragati.exception.InvalidCredentialsException;
import com.pragati.exception.UserAlreadyExistsException;
import com.pragati.repository.OfficerRepository;
import com.pragati.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.pragati.repository.UserRepository;
import java.util.*;
import java.util.stream.Collectors;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OfficerServiceImpl implements OfficerService {

    private final OfficerRepository officerRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public OfficerResponseDTO registerOfficer(
            String fullName, String email, String mobileNumber, String employeeId,
            String password, String department, String designation, String state, String district,
            MultipartFile govtIdFile, MultipartFile appointmentLetterFile
    ) {
        if (officerRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Officer with email " + email + " already exists");
        }
        if (officerRepository.existsByEmployeeId(employeeId)) {
            throw new UserAlreadyExistsException("Officer with Employee ID " + employeeId + " already exists");
        }

        // Save files
        String govtIdPath = fileStorageService.save(govtIdFile, "officers/govt-ids");
        String appointmentPath = fileStorageService.save(appointmentLetterFile, "officers/appointment-letters");

        Officer officer = Officer.builder()
                .fullName(fullName)
                .email(email)
                .mobileNumber(mobileNumber)
                .employeeId(employeeId)
                .password(passwordEncoder.encode(password))
                .department(department)
                .designation(designation)
                .state(state)
                .district(district)
                .govtIdFilePath(govtIdPath)
                .appointmentLetterFilePath(appointmentPath)
                .role(OfficerRole.OFFICER)
                .status(OfficerStatus.APPROVED) // Auto-approved; admin review flow can be added later
                .build();

        Officer savedOfficer = officerRepository.save(officer);

        return mapToResponse(savedOfficer, null);
    }

    @Override
    public OfficerResponseDTO loginOfficer(OfficerLoginRequest request) {
        Officer officer = officerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), officer.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (officer.getStatus() == OfficerStatus.PENDING) {
            throw new DisabledException("Your account is pending approval by the administrator.");
        }
        if (officer.getStatus() == OfficerStatus.REJECTED) {
            throw new DisabledException("Your account has been rejected. Contact administrator.");
        }

        // Generate JWT
        Map<String, Object> claims = new HashMap<>();
        claims.put("officerId", officer.getId());
        claims.put("role", officer.getRole().name());

        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
                officer.getEmail(),
                officer.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + officer.getRole().name()))
        );

        String token = jwtUtil.generateToken(claims, userDetails);

        return mapToResponse(officer, token);
    }

    @Override
    public List<CitizenDTO> getAllCitizens() {
        try {
            return userRepository.findAll().stream()
                    .map(user -> {
                        String village = (user.getVillage() != null) ? user.getVillage() : "N/A";
                        String district = (user.getDistrict() != null) ? user.getDistrict() : "N/A";
                        
                        return CitizenDTO.builder()
                                .id(user.getId())
                                .name(user.getFullName() != null ? user.getFullName() : "Unknown")
                                .mobile(user.getMobileNumber() != null ? user.getMobileNumber() : "No Mobile")
                                .location(village + ", " + district)
                                .maskedAadhaar(maskAadhaar(user.getAadhaarNumber()))
                                .status(Boolean.TRUE.equals(user.getAadhaarVerified()) ? "VERIFIED" : "PENDING")
                                .build();
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("CRITICAL: Error in getAllCitizens service: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null) return "XXXX-XXXX-XXXX";
        
        // Remove spaces if any
        String cleanAadhaar = aadhaar.replaceAll("\\s+", "");
        
        if (cleanAadhaar.length() < 4) return "XXXX-XXXX-XXXX";
        
        // Mask first 8 digits and show last 4
        return "XXXX-XXXX-" + cleanAadhaar.substring(Math.max(0, cleanAadhaar.length() - 4));
    }

    private OfficerResponseDTO mapToResponse(Officer officer, String token) {
        return OfficerResponseDTO.builder()
                .id(officer.getId())
                .fullName(officer.getFullName())
                .email(officer.getEmail())
                .employeeId(officer.getEmployeeId())
                .role(officer.getRole().name())
                .status(officer.getStatus().name())
                .department(officer.getDepartment())
                .designation(officer.getDesignation())
                .district(officer.getDistrict())
                .token(token)
                .build();
    }
}

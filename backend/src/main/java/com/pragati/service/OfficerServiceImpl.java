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
                .status(OfficerStatus.PENDING)
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

    private OfficerResponseDTO mapToResponse(Officer officer, String token) {
        return OfficerResponseDTO.builder()
                .id(officer.getId())
                .fullName(officer.getFullName())
                .email(officer.getEmail())
                .employeeId(officer.getEmployeeId())
                .role(officer.getRole().name())
                .status(officer.getStatus().name())
                .token(token)
                .build();
    }
}

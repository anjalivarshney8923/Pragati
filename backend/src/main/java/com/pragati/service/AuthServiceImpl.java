package com.pragati.service;

import com.pragati.dto.LoginRequestDTO;
import com.pragati.dto.LoginResponseDTO;
import com.pragati.dto.RegisterRequestDTO;
import com.pragati.dto.RegisterResponseDTO;
import com.pragati.dto.UserDTO;
import com.pragati.entity.User;
import com.pragati.exception.InvalidCredentialsException;
import com.pragati.exception.UserAlreadyExistsException;
import com.pragati.repository.UserRepository;
import com.pragati.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    // ================= REGISTER =================
    @Override
    public RegisterResponseDTO registerUser(RegisterRequestDTO request) {

        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new UserAlreadyExistsException(
                    "User with mobile number " + request.getMobileNumber() + " already exists"
            );
        }

        // Create user entity
        User user = User.builder()
                .fullName(request.getFullName())
                .mobileNumber(request.getMobileNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .state(request.getState())
                .district(request.getDistrict())
                .village(request.getVillage())
                .panchayat(request.getPanchayat())
                .aadhaarNumber(request.getAadhaarNumber())
                .build();

        User savedUser = userRepository.save(user);

        // Load user details for JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getMobileNumber());

        String jwtToken = jwtUtil.generateToken(userDetails);

        // Prepare response
        UserDTO userDTO = UserDTO.builder()
                .id(savedUser.getId())
                .name(savedUser.getFullName())
                .mobile(savedUser.getMobileNumber())
                .build();

        return RegisterResponseDTO.builder()
                .success(true)
                .message("User registered successfully")
                .token(jwtToken)
                .user(userDTO)
                .build();
    }

    // ================= LOGIN =================
    @Override
    public LoginResponseDTO loginUser(LoginRequestDTO request) {

        // Fetch user
        User user = userRepository.findByMobileNumber(request.getMobile())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid mobile number or password")
                );

        // Validate password (IMPORTANT)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid mobile number or password");
        }

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getMobileNumber());

        // Generate JWT
        String jwtToken = jwtUtil.generateToken(userDetails);

        // Map to DTO
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getFullName())
                .mobile(user.getMobileNumber())
                .build();

        return LoginResponseDTO.builder()
                .success(true)
                .message("Login successful")
                .token(jwtToken)
                .user(userDTO)
                .build();
    }

    // ================= AI PLACEHOLDERS =================
    @Override
    public boolean verifyAadhaar(String aadhaarNumber) {
        return true;
    }

    @Override
    public boolean verifyFace(Object faceData) {
        return true;
    }

    @Override
    public boolean verifyAge(String dob) {
        return true;
    }
}
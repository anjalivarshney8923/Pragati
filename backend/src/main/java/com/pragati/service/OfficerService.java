package com.pragati.service;

import com.pragati.dto.*;
import org.springframework.web.multipart.MultipartFile;

public interface OfficerService {
    OfficerResponseDTO registerOfficer(
        String fullName, String email, String mobileNumber, String employeeId,
        String password, String department, String designation, String state, String district,
        MultipartFile govtIdFile, MultipartFile appointmentLetterFile
    );

    OfficerResponseDTO loginOfficer(OfficerLoginRequest request);

    java.util.List<CitizenDTO> getAllCitizens();
}

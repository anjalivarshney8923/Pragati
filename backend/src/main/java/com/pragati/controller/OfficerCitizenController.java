package com.pragati.controller;

import com.pragati.dto.CitizenDTO;
import com.pragati.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerCitizenController {

    private final OfficerService officerService;

    @GetMapping("/citizens")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<CitizenDTO>> getAllCitizens() {
        try {
            System.out.println("Processing: Official Registry Request via OfficerCitizenController");
            List<CitizenDTO> citizens = officerService.getAllCitizens();
            return ResponseEntity.ok(citizens);
        } catch (Exception e) {
            System.err.println("500 ERROR DETECTED: Citizen Records API Crash");
            e.printStackTrace();
            throw e;
        }
    }
}

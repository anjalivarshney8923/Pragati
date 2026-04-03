package com.pragati.controller;

import com.pragati.dto.GeocodingResponseDTO;
import com.pragati.service.GeocodingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/geocode")
@RequiredArgsConstructor
@Slf4j
public class GeocodingController {

    private final GeocodingService geocodingService;

    @GetMapping
    public ResponseEntity<?> geocode(@RequestParam String address) {
        try {
            GeocodingResponseDTO result = geocodingService.geocodeAddress(address);
            
            if (result != null) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("error", "Address not found"));
            }
            
        } catch (Exception e) {
            log.error("Backend geocoding error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Geocoding failed: " + e.getMessage()));
        }
    }
}

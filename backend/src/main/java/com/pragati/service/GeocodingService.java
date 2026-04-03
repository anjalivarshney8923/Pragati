package com.pragati.service;

import com.pragati.dto.GeocodingResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Slf4j
public class GeocodingService {

    private final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
    private final RestTemplate restTemplate = new RestTemplate();

    public GeocodingResponseDTO geocodeAddress(String address) {
        try {
            log.info("Geocoding address: {}", address);

            // Step 1: Fix API Request with URL Encoding
            String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                    .queryParam("q", address)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .toUriString();

            // Step 2: Add REQUIRED Headers
            HttpHeaders headers = new HttpHeaders();
            // Format: Pragati-App (email@example.com)
            headers.set("User-Agent", "Pragati-App (anjalivarshney8923@gmail.com)");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Step 1 cont: Use exchange()
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            // Step 3 & 4: Parse response with org.json
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JSONArray jsonArray = new JSONArray(response.getBody());
                
                if (!jsonArray.isEmpty()) {
                    JSONObject obj = jsonArray.getJSONObject(0);
                    
                    return GeocodingResponseDTO.builder()
                            .latitude(obj.getDouble("lat"))
                            .longitude(obj.getDouble("lon"))
                            .displayName(obj.getString("display_name"))
                            .build();
                }
            }
            
            log.warn("No results found for address: {}", address);
            return null; // Controller will handle as 404

        } catch (Exception e) {
            log.error("Geocoding failed: {}", e.getMessage());
            throw new RuntimeException("Geocoding failed: " + e.getMessage());
        }
    }
}

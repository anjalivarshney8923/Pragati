package com.pragati.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class BlockchainService {

    private final String FLASK_API_URL = "http://127.0.0.1:5001/store-hash";
    private final RestTemplate restTemplate = new RestTemplate();

    public String getBlockchainTxnId(String complaintDescription) {
        try {
            log.info("Sending complaint to blockchain service: {}", complaintDescription);

            // Prepare Request Body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("complaint", complaintDescription);

            // Set Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            // Call Flask API
            Map<String, Object> response = restTemplate.postForObject(FLASK_API_URL, request, Map.class);

            if (response != null && "success".equals(response.get("status"))) {
                String txId = (String) response.get("blockchainTxnId");
                log.info("Successfully received blockchain transaction ID: {}", txId);
                return txId;
            } else {
                log.warn("Flask API returned an unsuccessful status or null response.");
                return null;
            }
        } catch (Exception e) {
            log.error("Failed to connect to Blockchain Flask Service: {}", e.getMessage());
            return null; // Return null so it doesn't break the main flow
        }
    }
}

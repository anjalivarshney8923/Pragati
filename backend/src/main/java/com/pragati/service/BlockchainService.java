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

    // Standard Port 5001 (Fixed as per user requirement)
    private final String FLASK_API_URL = "http://localhost:5001/store-hash";
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, String> storeComplaintHash(Map<String, Object> structuredData) {
        try {
            System.out.println("[Blockchain] Calling Flask API: " + FLASK_API_URL);
            log.info("Sending data for ID: {}", structuredData.get("id"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(structuredData, headers);

            // Execute POST and capture response
            Map<String, Object> response = restTemplate.postForObject(FLASK_API_URL, request, Map.class);
            System.out.println("[Blockchain] Received response from Flask: " + response);

            if (response != null && "success".equals(response.get("status"))) {
                Map<String, String> result = new HashMap<>();
                
                // Extract blockchainTxnId from Flask response

                System.out.println("🔥 FULL FLASK RESPONSE: " + response);

                String txnId = (String) response.get("blockchainTxnId");
                String hash = (String) response.get("hash");
                
                System.out.println("[Blockchain] Extracted txnId: " + txnId);
                
                result.put("txnId", txnId);
                result.put("hash", hash);
                return result;
            } else {
                log.error("Flask API returned failure. Check Flask console for details.");
                return null;
            }
        } catch (Exception e) {
            System.err.println("[Blockchain] CRITICAL ERROR: Could not connect to AI-service at " + FLASK_API_URL);
            log.error("Blockchain Bridge Error: {}", e.getMessage());
            return null;
        }
    }

    public String recalculateHash(Map<String, Object> data) {
        try {
            String url = "http://localhost:5001/calculate-hash";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(data, headers);

            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);
            if (response != null && response.containsKey("hash")) {
                return (String) response.get("hash");
            }
            return null;
        } catch (Exception e) {
            log.error("recalculateHash failed: {}", e.getMessage());
            return null;
        }
    }
}

package com.pragati.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Value("${fast2sms.api.key}")
    private String apiKey;

    private final String FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";

    public boolean sendOtp(String mobileNumber, String otpMsg) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        // Fast2SMS uniquely requires authorization header without "Bearer "
        headers.set("authorization", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        // Now that API route is unlocked via the 100 INR payment, 'q' will work natively without website verification blockers!
        body.put("route", "q"); 
        body.put("message", "Your Pragati Portal access code is: " + otpMsg + ". Do not share this.");
        body.put("language", "english");
        body.put("flash", 0);
        body.put("numbers", mobileNumber);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(FAST2SMS_URL, entity, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            System.err.println("Fast2SMS API Exception: " + e.getMessage());
            return false;
        }
    }
}

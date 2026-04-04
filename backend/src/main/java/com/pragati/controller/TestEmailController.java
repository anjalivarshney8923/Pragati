package com.pragati.controller;

import com.pragati.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test-email")
@RequiredArgsConstructor
public class TestEmailController {

    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<Map<String, String>> testEmailDelivery(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please provide ?email=your_address@gmail.com"));
        }
        
        emailService.sendEmail(
                email,
                "Test Email from Pragati GramSetu",
                "<html><body><h2>Notification system is working!</h2><p>This confirms the Application.yml Google SMTP configuration is successfully connected.</p></body></html>"
        );
        
        return ResponseEntity.ok(Map.of("message", "Test email triggered successfully to " + email));
    }
}

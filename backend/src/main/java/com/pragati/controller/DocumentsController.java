package com.pragati.controller;

import com.pragati.entity.User;
import com.pragati.repository.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class DocumentsController {

    private final UserRepository userRepository;

    public DocumentsController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<?> uploadDocuments(
        @PathVariable Long id,
        @RequestParam(name = "aadhaar", required = false) MultipartFile aadhaar,
        @RequestParam(name = "selfie", required = false) MultipartFile selfie,
        @RequestParam(name = "match", required = false) Boolean match,
        @RequestParam(name = "confidence", required = false) Double confidence,
        @RequestParam(name = "dob", required = false) String dob,
        @RequestParam(name = "dobVerified", required = false) Boolean dobVerified
    ) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = opt.get();
        try {
            if (aadhaar != null && !aadhaar.isEmpty()) {
                user.setAadhaarImage(aadhaar.getBytes());
                user.setAadhaarImageContentType(aadhaar.getContentType());
            }
            if (selfie != null && !selfie.isEmpty()) {
                user.setSelfieImage(selfie.getBytes());
                user.setSelfieImageContentType(selfie.getContentType());
            }
            // If verification info provided and confidence exceeds threshold, mark verified
            final double THRESHOLD = 0.35;
            if (match != null && confidence != null) {
                if (match && confidence > THRESHOLD) {
                    user.setAadhaarVerified(true);
                    user.setFaceVerified(true);
                }
            }

            // If DOB supplied, try to parse and save
            if (dob != null && !dob.isBlank()) {
                try {
                    java.time.LocalDate parsed = java.time.LocalDate.parse(dob);
                    user.setDateOfBirth(parsed);
                } catch (Exception ignored) {
                    // try other common formats
                    try {
                        java.time.format.DateTimeFormatter f1 = java.time.format.DateTimeFormatter.ofPattern("d/M/yyyy");
                        user.setDateOfBirth(java.time.LocalDate.parse(dob, f1));
                    } catch (Exception ex) {
                        // ignore parse failure
                    }
                }
            }

            if (dobVerified != null) {
                user.setDobVerified(dobVerified);
            }
            userRepository.save(user);
            return ResponseEntity.ok().body("Documents uploaded");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to read uploaded files");
        }
    }

    @GetMapping("/{id}/documents/aadhaar")
    public ResponseEntity<byte[]> getAadhaarImage(@PathVariable Long id) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User user = opt.get();
        byte[] img = user.getAadhaarImage();
        if (img == null) return ResponseEntity.notFound().build();
        String contentType = user.getAadhaarImageContentType();
        if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename= Aadhaar_" + id);
        return ResponseEntity.ok().headers(headers).body(img);
    }

    @GetMapping("/{id}/documents/selfie")
    public ResponseEntity<byte[]> getSelfieImage(@PathVariable Long id) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User user = opt.get();
        byte[] img = user.getSelfieImage();
        if (img == null) return ResponseEntity.notFound().build();
        String contentType = user.getSelfieImageContentType();
        if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline; filename= Selfie_" + id);
        return ResponseEntity.ok().headers(headers).body(img);
    }
}

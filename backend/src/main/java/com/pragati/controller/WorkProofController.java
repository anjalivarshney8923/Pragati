package com.pragati.controller;

import com.pragati.entity.WorkProof;
import com.pragati.service.WorkProofService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pragati.dto.WorkProofDTO;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workproof")
@RequiredArgsConstructor
public class WorkProofController {

    private final WorkProofService workProofService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitWorkProof(
            @RequestParam(value = "complaintId", required = false) Long complaintId,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "beforeImage", required = false) MultipartFile beforeImage) {
        
        try {
            WorkProofDTO saved = workProofService.submitWorkProofDTO(complaintId, description, image, beforeImage);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error submitting work proof: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<WorkProofDTO>> getAllWorkProofs() {
        return ResponseEntity.ok(workProofService.getAllWorkProofs());
    }

    @GetMapping("/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyWorkProof(@PathVariable Long id) {
        Map<String, Object> result = workProofService.verifyWorkProof(id);
        return ResponseEntity.ok(result);
    }
}

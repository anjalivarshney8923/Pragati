package com.pragati.controller;

import com.pragati.entity.WorkProof;
import com.pragati.service.WorkProofService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pragati.dto.WorkProofDTO;
import java.util.List;

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

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<?> getWorkProofByComplaintId(@PathVariable Long complaintId) {
        try {
            WorkProofDTO wp = workProofService.getWorkProofByComplaintId(complaintId);
            if (wp != null) {
                return ResponseEntity.ok(wp);
            } else {
                return ResponseEntity.status(404).body("No work proof found for this complaint");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching work proof: " + e.getMessage());
        }
    }

}

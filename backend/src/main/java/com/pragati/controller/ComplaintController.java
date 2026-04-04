package com.pragati.controller;

import com.pragati.dto.ComplaintRequestDTO;
import com.pragati.dto.ComplaintResponseDTO;
import com.pragati.dto.ComplaintStatusUpdateDTO;
import com.pragati.dto.NearbyComplaintDTO;
import com.pragati.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponseDTO> createComplaint(@Valid @ModelAttribute ComplaintRequestDTO request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        ComplaintResponseDTO response = complaintService.createComplaint(request, username);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponseDTO>> getMyComplaints() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(complaintService.getUserComplaints(username));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponseDTO>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyComplaintDTO>> getNearbyComplaints(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5.0") Double radius) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(complaintService.getNearbyComplaints(latitude, longitude, radius, username));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id, @Valid @RequestBody ComplaintStatusUpdateDTO request) {
        complaintService.updateStatus(id, request.getStatus());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Status updated successfully.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/escalate/vibhag")
    public ResponseEntity<?> escalateToVibhag(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(complaintService.escalateToVibhag(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/escalate/bdo")
    public ResponseEntity<?> escalateToBDO(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(complaintService.escalateToBDO(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(complaintService.getComplaintById(id, username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/support")
    public ResponseEntity<?> supportComplaint(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            long updatedCount = complaintService.supportComplaint(id, username);
            Map<String, Object> result = new HashMap<>();
            result.put("message", "Complaint supported successfully");
            result.put("supportCount", updatedCount);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            String msg = e.getMessage() != null ? e.getMessage() : "Error";
            if (msg.toLowerCase().contains("already supported") || msg.toLowerCase().contains("already")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", msg));
            }
            if (msg.toLowerCase().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", msg));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", msg));
        }
    }
}

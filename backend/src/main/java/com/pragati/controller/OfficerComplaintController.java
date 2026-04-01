package com.pragati.controller;

import com.pragati.dto.ComplaintDTO;
import com.pragati.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
@Slf4j
public class OfficerComplaintController {

    private final ComplaintService complaintService;

    @GetMapping("/complaints")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> getAllComplaints() {
        log.info("Incoming Officer API call: GET /api/officer/complaints");
        try {
            List<ComplaintDTO> response = complaintService.getAllComplaintsForOfficer();
            log.info("Returning {} complaints to officer", response.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("FAILURE in officer complaint fetch: {}", e.getMessage(), e);
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("success", false);
            errorDetails.put("message", "Error fetching complaints: " + e.getMessage());
            errorDetails.put("timestamp", java.time.LocalDateTime.now());
            return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/complaints/{id}/status")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        log.info("Update status for complaint ID {} by officer", id);
        try {
            String status = request.get("status");
            complaintService.updateStatus(id, status);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Status updated successfully to " + status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating complaint status: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }
}

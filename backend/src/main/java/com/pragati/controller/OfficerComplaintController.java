package com.pragati.controller;

import com.pragati.dto.ComplaintDTO;
import com.pragati.entity.Officer;
import com.pragati.repository.OfficerRepository;
import com.pragati.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
@Slf4j
public class OfficerComplaintController {

    private final ComplaintService complaintService;
    private final OfficerRepository officerRepository;

    // ─── Helper: get department of logged-in officer ──────────────────────────────
    private String getLoggedInDepartment() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth != null ? auth.getName() : null;
            if (email == null) return null;
            return officerRepository.findByEmail(email)
                    .map(Officer::getDepartment)
                    .orElse(null);
        } catch (Exception e) {
            log.warn("Could not resolve officer department: {}", e.getMessage());
            return null;
        }
    }

    // ─── GET COMPLAINTS (filtered by officer's department) ─────────────────────────
    @GetMapping("/complaints")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> getAllComplaints() {
        log.info("GET /api/officer/complaints — resolving department filter");
        try {
            String department = getLoggedInDepartment();
            log.info("Officer department: {}", department);
            List<ComplaintDTO> response = complaintService.getAllComplaintsForOfficer(department);
            log.info("Returning {} complaints for department {}", response.size(), department);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("FAILURE in officer complaint fetch: {}", e.getMessage(), e);
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Error fetching complaints: " + e.getMessage());
            return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ─── UPDATE STATUS ─────────────────────────────────────────────────────────────
    @PutMapping("/complaints/{id}/status")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("PUT /api/officer/complaints/{}/status", id);
        try {
            String status = request.get("status");
            complaintService.updateStatus(id, status);
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "Status updated successfully to " + status);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            log.error("Error updating complaint status: {}", e.getMessage());
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
        }
    }

    // ─── STATS (department-scoped) ──────────────────────────────────────────────────
    @GetMapping("/stats")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> getOfficerStats() {
        try {
            String department = getLoggedInDepartment();
            return ResponseEntity.ok(complaintService.getOfficerStats(department));
        } catch (Exception e) {
            log.error("Error fetching officer stats: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── DEPARTMENT INFO ──────────────────────────────────────────────────────────
    @GetMapping("/me/department")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> getMyDepartment() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            return officerRepository.findByEmail(email)
                    .map(o -> ResponseEntity.ok(Map.of(
                            "department", o.getDepartment() != null ? o.getDepartment() : "BDO",
                            "designation", o.getDesignation() != null ? o.getDesignation() : "",
                            "fullName", o.getFullName(),
                            "district", o.getDistrict() != null ? o.getDistrict() : ""
                    )))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PRADHAN: ALL COMPLAINTS (no category filter, sorted by support count) ─────
    @GetMapping("/pradhan/complaints")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> getPradhanComplaints() {
        log.info("GET /api/officer/pradhan/complaints");
        try {
            String department = getLoggedInDepartment();
            if (!"PRADHAN".equalsIgnoreCase(department) && !"BDO".equalsIgnoreCase(department)) {
                return new ResponseEntity<>(
                    Map.of("success", false, "message", "Access denied. Pradhan officers only."),
                    HttpStatus.FORBIDDEN
                );
            }
            // Pass "PRADHAN" → sees ALL complaints
            List<ComplaintDTO> complaints = complaintService.getAllComplaintsForOfficer("PRADHAN");
            log.info("Pradhan complaints: {} records returned", complaints.size());
            Map<String, Object> response = new HashMap<>();
            response.put("complaints", complaints);
            response.put("total", complaints.size());
            response.put("department", department);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching Pradhan complaints: {}", e.getMessage(), e);
            return new ResponseEntity<>(
                Map.of("success", false, "message", "Error: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

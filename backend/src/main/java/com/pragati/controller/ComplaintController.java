package com.pragati.controller;

import com.pragati.dto.ComplaintRequestDTO;
import com.pragati.dto.ComplaintResponseDTO;
import com.pragati.dto.ComplaintStatusUpdateDTO;
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

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id, @Valid @RequestBody ComplaintStatusUpdateDTO request) {
        complaintService.updateStatus(id, request.getStatus());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Status updated successfully.");
        return ResponseEntity.ok(response);
    }
}

package com.pragati.service;

import com.pragati.dto.ComplaintRequestDTO;
import com.pragati.dto.ComplaintResponseDTO;
import com.pragati.dto.ComplaintDTO;
import com.pragati.entity.Complaint;
import com.pragati.entity.ComplaintStatus;
import com.pragati.entity.User;
import com.pragati.repository.ComplaintRepository;
import com.pragati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO request, String mobileNumber) {
        log.info("Creating new complaint for mobile: {}", mobileNumber);
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileStorageService.saveFile(request.getImage());
        }

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation() != null ? request.getLocation() : "Unknown")
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imageUrl(imageUrl)
                .user(user)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponseDTO> getUserComplaints(String mobileNumber) {
        log.info("Fetching complaints for user: {}", mobileNumber);
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return complaintRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponseDTO> getAllComplaints() {
        log.info("Fetching all complaints (Villager View)");
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintDTO> getAllComplaintsForOfficer() {
        log.info("Officer Feed Request: Fetching all complaints from database...");
        try {
            List<Complaint> entities = complaintRepository.findAllByOrderByCreatedAtDesc();
            log.info("Successfully fetched {} complaints", entities.size());
            return entities.stream()
                    .map(this::mapToOfficerGenericDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("CRITICAL: Error in fetching officer complaints: {}", e.getMessage(), e);
            throw new RuntimeException("Backend database fetch failed: " + e.getMessage());
        }
    }

    @Transactional
    public void updateStatus(Long id, String status) {
        log.info("Updating status for complaint ID: {} to {}", id, status);
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        
        try {
            complaint.setStatus(ComplaintStatus.valueOf(status.toUpperCase()));
            complaintRepository.save(complaint);
        } catch (IllegalArgumentException e) {
            log.error("Invalid status provided: {}", status);
            throw new RuntimeException("Invalid status provided: " + status);
        }
    }

    private ComplaintDTO mapToOfficerGenericDTO(Complaint c) {
        // Construct accessible attachment URL safely
        String baseUrl = "http://localhost:8080"; 
        String attachmentUrl = (c.getImageUrl() != null && !c.getImageUrl().isEmpty()) 
                               ? baseUrl + c.getImageUrl() 
                               : null;
        
        return ComplaintDTO.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory())
                .location(c.getLocation() != null ? c.getLocation() : "Not Provided")
                .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                .createdAt(c.getCreatedAt())
                .attachmentPath(attachmentUrl)
                .build();
    }

    private ComplaintResponseDTO mapToDTO(Complaint c) {
        String userFullName = "Deleted User";
        try {
            if (c.getUser() != null) {
                userFullName = c.getUser().getFullName();
            }
        } catch (Exception e) {
            log.warn("Could not lazily load user for complaint ID: {}", c.getId());
        }

        return ComplaintResponseDTO.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory())
                .location(c.getLocation() != null ? c.getLocation() : "Unknown")
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .imageUrl(c.getImageUrl())
                .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                .createdAt(c.getCreatedAt())
                .userFullName(userFullName)
                .build();
    }
}

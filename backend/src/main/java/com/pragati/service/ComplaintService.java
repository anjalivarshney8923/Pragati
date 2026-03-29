package com.pragati.service;

import com.pragati.dto.ComplaintRequestDTO;
import com.pragati.dto.ComplaintResponseDTO;
import com.pragati.entity.Complaint;
import com.pragati.entity.ComplaintStatus;
import com.pragati.entity.User;
import com.pragati.repository.ComplaintRepository;
import com.pragati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO request, String mobileNumber) {
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
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imageUrl(imageUrl)
                .user(user)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapToDTO(saved);
    }

    public List<ComplaintResponseDTO> getUserComplaints(String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return complaintRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponseDTO> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void updateStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        
        try {
            complaint.setStatus(ComplaintStatus.valueOf(status.toUpperCase()));
            complaintRepository.save(complaint);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status provided");
        }
    }

    private ComplaintResponseDTO mapToDTO(Complaint c) {
        return ComplaintResponseDTO.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory())
                .location(c.getLocation())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .imageUrl(c.getImageUrl())
                .status(c.getStatus().name())
                .createdAt(c.getCreatedAt())
                .userFullName(c.getUser().getFullName())
                .build();
    }
}

package com.pragati.service;

import com.pragati.dto.ComplaintRequestDTO;
import com.pragati.dto.ComplaintResponseDTO;
import com.pragati.dto.ComplaintDTO;
import com.pragati.dto.NearbyComplaintDTO;
import com.pragati.entity.Complaint;
import com.pragati.entity.ComplaintStatus;
import com.pragati.entity.ComplaintSupport;
import com.pragati.entity.User;
import com.pragati.repository.ComplaintRepository;
import com.pragati.repository.ComplaintSupportRepository;
import com.pragati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final BlockchainService blockchainService;
    private final ComplaintSupportRepository supportRepository;

    // ─── CREATE COMPLAINT ────────────────────────────────────────────────────────

    @Transactional
    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO request, String mobileNumber) {
        log.info("Creating complaint for: {}", mobileNumber);
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileStorageService.saveFile(request.getImage());
        }

        String txnId = blockchainService.getBlockchainTxnId(request.getDescription());

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation() != null ? request.getLocation() : "Unknown")
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imageUrl(imageUrl)
                .user(user)
                .blockchainTxnId(txnId)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapToDTO(saved, user.getId());
    }

    // ─── SUPPORT COMPLAINT ───────────────────────────────────────────────────────

    @Transactional
    public long supportComplaint(Long complaintId, String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (supportRepository.existsByComplaintIdAndUserId(complaintId, user.getId())) {
            throw new RuntimeException("Already supported");
        }

        ComplaintSupport support = new ComplaintSupport();
        support.setComplaint(complaint);
        support.setUser(user);
        support.setSupportedAt(LocalDateTime.now());
        supportRepository.save(support);

        return supportRepository.countByComplaintId(complaintId);
    }

    // ─── GET MY COMPLAINTS (created + supported) ─────────────────────────────────

    @Transactional(readOnly = true)
    public List<ComplaintResponseDTO> getUserComplaints(String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Complaint> createdByMe = complaintRepository.findByUserOrderByCreatedAtDesc(user);

        List<Complaint> supportedByMe = supportRepository.findByUserId(user.getId()).stream()
                .map(ComplaintSupport::getComplaint)
                .collect(Collectors.toList());

        Set<Complaint> merged = new LinkedHashSet<>(createdByMe);
        merged.addAll(supportedByMe);

        return merged.stream()
                .map(c -> mapToDTO(c, user.getId()))
                .collect(Collectors.toList());
    }

    // ─── GET ALL COMPLAINTS ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ComplaintResponseDTO> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(c -> mapToDTO(c, null))
                .collect(Collectors.toList());
    }

    // ─── GET NEARBY COMPLAINTS ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<NearbyComplaintDTO> getNearbyComplaints(Double lat, Double lon, Double radius, String currentMobile) {
        User currentUser = userRepository.findByMobileNumber(currentMobile).orElse(null);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        List<Complaint> allComplaints = complaintRepository.findAll();

        return allComplaints.stream()
                .filter(c -> c.getUser() != null && !c.getUser().getMobileNumber().equals(currentMobile))
                .filter(c -> c.getLatitude() != null && c.getLongitude() != null)
                .map(c -> {
                    double distance = calculateDistance(lat, lon, c.getLatitude(), c.getLongitude());
                    boolean isSupported = currentUserId != null
                            && supportRepository.existsByComplaintIdAndUserId(c.getId(), currentUserId);
                    long count = supportRepository.countByComplaintId(c.getId());
                    return NearbyComplaintDTO.builder()
                            .id(c.getId())
                            .title(c.getTitle() != null ? c.getTitle() : "No Title")
                            .description(c.getDescription() != null ? c.getDescription() : "No Description")
                            .category(c.getCategory() != null ? c.getCategory() : "GENERAL")
                            .location(c.getLocation() != null ? c.getLocation() : "Unknown Location")
                            .latitude(c.getLatitude())
                            .longitude(c.getLongitude())
                            .distance(Math.round(distance * 100.0) / 100.0)
                            .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                            .imageUrl(c.getImageUrl())
                            .createdAt(c.getCreatedAt())
                            .supportCount((int) count)
                            .isSupportedByCurrentUser(isSupported)
                            .build();
                })
                .filter(dto -> dto.getDistance() <= radius)
                .sorted((a, b) -> {
                    int sc = Integer.compare(
                            b.getSupportCount() != null ? b.getSupportCount() : 0,
                            a.getSupportCount() != null ? a.getSupportCount() : 0);
                    if (sc != 0) return sc;
                    return Double.compare(a.getDistance(), b.getDistance());
                })
                .limit(20)
                .collect(Collectors.toList());
    }

    // ─── UPDATE STATUS ────────────────────────────────────────────────────────────

    @Transactional
    public void updateStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        try {
            complaint.setStatus(ComplaintStatus.valueOf(status.toUpperCase()));
            complaintRepository.save(complaint);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    // ─── OFFICER VIEW ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ComplaintDTO> getAllComplaintsForOfficer() {
        return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToOfficerDTO)
                .collect(Collectors.toList());
    }

    // ─── MAPPING HELPERS ──────────────────────────────────────────────────────────

    private ComplaintResponseDTO mapToDTO(Complaint c, Long currentUserId) {
        String userFullName = "Anonymous";
        try {
            if (c.getUser() != null) userFullName = c.getUser().getFullName();
        } catch (Exception ignored) {}

        boolean isSupported = currentUserId != null
                && supportRepository.existsByComplaintIdAndUserId(c.getId(), currentUserId);
        long count = supportRepository.countByComplaintId(c.getId());

        return ComplaintResponseDTO.builder()
                .id(c.getId())
                .title(c.getTitle() != null ? c.getTitle() : "No Title")
                .description(c.getDescription() != null ? c.getDescription() : "No Description")
                .category(c.getCategory() != null ? c.getCategory() : "GENERAL")
                .location(c.getLocation() != null ? c.getLocation() : "Unknown Location")
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .imageUrl(c.getImageUrl())
                .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                .createdAt(c.getCreatedAt())
                .userFullName(userFullName)
                .blockchainTxnId(c.getBlockchainTxnId())
                .supportCount((int) count)
                .isSupportedByCurrentUser(isSupported)
                .build();
    }

    private ComplaintDTO mapToOfficerDTO(Complaint c) {
        String baseUrl = "http://localhost:8080";
        String attachmentUrl = (c.getImageUrl() != null && !c.getImageUrl().isEmpty())
                ? baseUrl + c.getImageUrl() : null;
        return ComplaintDTO.builder()
                .id(c.getId()).title(c.getTitle()).description(c.getDescription())
                .category(c.getCategory()).location(c.getLocation())
                .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                .createdAt(c.getCreatedAt()).attachmentPath(attachmentUrl)
                .blockchainTxnId(c.getBlockchainTxnId()).build();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}

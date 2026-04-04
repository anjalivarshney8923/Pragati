package com.pragati.service;

import com.pragati.dto.ComplaintRequestDTO;
import com.pragati.dto.ComplaintResponseDTO;
import com.pragati.dto.ComplaintDTO;
import com.pragati.dto.NearbyComplaintDTO;
import com.pragati.entity.*;
import com.pragati.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
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
    private final DepartmentComplaintRepository departmentComplaintRepository;
    private final BDOComplaintRepository bdoComplaintRepository;
    private final NotificationRepository notificationRepository;
    private final EscalationService escalationService;

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
        String token = generateUniqueToken();

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
                .complaintToken(token)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        escalationService.scheduleEscalation(saved.getId(), user.getId(), token);
        return mapToDTO(saved, user.getId());
    }

    private String generateUniqueToken() {
        String token;
        do {
            int digits = 100000 + new Random().nextInt(900000);
            token = "CMP-" + Year.now().getValue() + "-" + digits;
        } while (complaintRepository.existsByComplaintToken(token));
        return token;
    }

    // ─── ESCALATE TO VIBHAG ───────────────────────────────────────────────────────

    @Transactional
    public ComplaintResponseDTO escalateToVibhag(Long complaintId, String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        if (complaint.getEscalationLevel() < 1)
            throw new RuntimeException("Escalation to Vibhag not yet available");
        if (departmentComplaintRepository.existsByComplaintId(complaintId))
            throw new RuntimeException("Already escalated to Vibhag");

        String dept = mapCategoryToDepartment(complaint.getCategory());
        departmentComplaintRepository.save(DepartmentComplaint.builder()
                .complaint(complaint)
                .departmentName(dept)
                .build());

        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        complaintRepository.save(complaint);

        notificationRepository.save(Notification.builder()
                .userId(user.getId())
                .relatedComplaintId(complaintId)
                .title("Escalated to " + dept)
                .message("Your complaint (" + complaint.getComplaintToken() + ") has been escalated to " + dept + ".")
                .type("ESCALATION")
                .build());

        return mapToDTO(complaint, user.getId());
    }

    // ─── ESCALATE TO BDO ──────────────────────────────────────────────────────────

    @Transactional
    public ComplaintResponseDTO escalateToBDO(Long complaintId, String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        if (complaint.getEscalationLevel() < 2)
            throw new RuntimeException("Escalation to BDO not yet available");
        if (bdoComplaintRepository.existsByComplaintId(complaintId))
            throw new RuntimeException("Already escalated to BDO");

        bdoComplaintRepository.save(BDOComplaint.builder()
                .complaint(complaint)
                .blockName(complaint.getLocation())
                .build());

        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        complaintRepository.save(complaint);

        notificationRepository.save(Notification.builder()
                .userId(user.getId())
                .relatedComplaintId(complaintId)
                .title("Escalated to BDO")
                .message("Your complaint (" + complaint.getComplaintToken() + ") has been escalated to the Block Development Officer (BDO).")
                .type("ESCALATION")
                .build());

        return mapToDTO(complaint, user.getId());
    }

    // ─── GET COMPLAINT BY ID ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ComplaintResponseDTO getComplaintById(Long id, String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return mapToDTO(complaint, user.getId());
    }

    private String mapCategoryToDepartment(String category) {
        if (category == null) return "Samanya Vibhag";
        return switch (category.toUpperCase()) {
            case "ELECTRICITY", "POWER", "STREETLIGHT" -> "Bijli Vibhag";
            case "WATER", "WATER_SUPPLY", "DRINKING_WATER" -> "Jal Vibhag";
            case "ROAD", "ROADS", "POTHOLE", "TRANSPORT" -> "PWD";
            case "SANITATION", "GARBAGE", "WASTE" -> "Swachhta Vibhag";
            default -> "Samanya Vibhag";
        };
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

    // ─── DEPARTMENT → CATEGORY MAPPING ───────────────────────────────────────────

    private static final Map<String, List<String>> DEPT_CATEGORIES = new java.util.LinkedHashMap<>();
    static {
        DEPT_CATEGORIES.put("JAL_VIBHAG",   List.of("WATER", "WATER_SUPPLY", "DRINKING_WATER", "SEWAGE"));
        DEPT_CATEGORIES.put("ELECTRICITY",   List.of("ELECTRICITY", "POWER", "STREETLIGHT", "LIGHT"));
        DEPT_CATEGORIES.put("ROAD",          List.of("ROAD", "ROADS", "POTHOLE", "TRANSPORT", "DRAINAGE"));
        DEPT_CATEGORIES.put("SWACHHTA",      List.of("SANITATION", "CLEANLINESS", "SWACHHTA", "GARBAGE", "WASTE"));
        DEPT_CATEGORIES.put("NAGAR_NIGAM",   List.of("MUNICIPAL", "NAGAR", "BUILDING", "CONSTRUCTION"));
        // PRADHAN and BDO see ALL — not listed here
    }

    private boolean categoryMatchesDepartment(String category, String department) {
        // These roles/departments see ALL complaints with no filtering
        if (department == null || department.isBlank()
                || department.equalsIgnoreCase("BDO")
                || department.equalsIgnoreCase("PRADHAN")) {
            return true;
        }
        List<String> allowedCategories = DEPT_CATEGORIES.get(department.toUpperCase());
        if (allowedCategories == null) return true; // unknown dept → safe fallback: see all
        String cat = category != null ? category.toUpperCase() : "";
        return allowedCategories.stream().anyMatch(cat::contains) ||
               allowedCategories.stream().anyMatch(a -> a.contains(cat) && !cat.isEmpty());
    }

    // ─── OFFICER VIEW ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ComplaintDTO> getAllComplaintsForOfficer() {
        return getAllComplaintsForOfficer(null);
    }

    @Transactional(readOnly = true)
    public List<ComplaintDTO> getAllComplaintsForOfficer(String officerDepartment) {
        // BDO: only show complaints escalated to BDO
        if (officerDepartment == null || officerDepartment.equalsIgnoreCase("BDO")) {
            return bdoComplaintRepository.findAll().stream()
                    .map(bc -> {
                        ComplaintDTO dto = mapToOfficerDTO(bc.getComplaint());
                        dto.setEscalatedToDepartment("BDO");
                        return dto;
                    })
                    .sorted((a, b) -> Long.compare(b.getSupportCount(), a.getSupportCount()))
                    .collect(Collectors.toList());
        }

        // PRADHAN: sees all complaints
        if (officerDepartment.equalsIgnoreCase("PRADHAN")) {
            return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(this::mapToOfficerDTO)
                    .sorted((a, b) -> Long.compare(b.getSupportCount(), a.getSupportCount()))
                    .collect(Collectors.toList());
        }

        // Vibhag officers: only show complaints escalated to their department
        String mappedDeptName = mapOfficerDeptToVibhagName(officerDepartment);
        return departmentComplaintRepository.findByDepartmentNameIgnoreCase(mappedDeptName).stream()
                .map(dc -> {
                    ComplaintDTO dto = mapToOfficerDTO(dc.getComplaint());
                    dto.setEscalatedToDepartment(dc.getDepartmentName());
                    return dto;
                })
                .sorted((a, b) -> Long.compare(b.getSupportCount(), a.getSupportCount()))
                .collect(Collectors.toList());
    }

    // Maps officer's department key (stored in DB) → Vibhag display name used in department_complaints
    private String mapOfficerDeptToVibhagName(String dept) {
        if (dept == null) return "Samanya Vibhag";
        return switch (dept.toUpperCase()) {
            case "ELECTRICITY" -> "Bijli Vibhag";
            case "JAL_VIBHAG"  -> "Jal Vibhag";
            case "ROAD"        -> "PWD";
            case "SWACHHTA"    -> "Swachhta Vibhag";
            case "NAGAR_NIGAM" -> "Samanya Vibhag";
            default            -> dept;
        };
    }

    // ─── OFFICER STATS ────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Long> getOfficerStats(String officerDepartment) {
        List<Complaint> all = complaintRepository.findAll().stream()
                .filter(c -> categoryMatchesDepartment(c.getCategory(), officerDepartment))
                .collect(Collectors.toList());
        Map<String, Long> stats = new java.util.LinkedHashMap<>();
        stats.put("total", (long) all.size());
        stats.put("pending", all.stream().filter(c -> c.getStatus() == ComplaintStatus.PENDING).count());
        stats.put("inProgress", all.stream().filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS).count());
        stats.put("resolved", all.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED).count());
        return stats;
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

        int level = c.getEscalationLevel() != null ? c.getEscalationLevel() : 0;
        boolean alreadyEscalatedToVibhag = departmentComplaintRepository.existsByComplaintId(c.getId());
        boolean alreadyEscalatedToBDO = bdoComplaintRepository.existsByComplaintId(c.getId());
        return ComplaintResponseDTO.builder()
                .id(c.getId())
                .complaintToken(c.getComplaintToken())
                .title(c.getTitle() != null ? c.getTitle() : "No Title")
                .description(c.getDescription() != null ? c.getDescription() : "No Description")
                .category(c.getCategory() != null ? c.getCategory() : "GENERAL")
                .location(c.getLocation() != null ? c.getLocation() : "Unknown Location")
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .imageUrl(c.getImageUrl())
                .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                .escalationLevel(level)
                .canEscalateToVibhag(level >= 1 && !alreadyEscalatedToVibhag)
                .canEscalateToBDO(level >= 2 && alreadyEscalatedToVibhag && !alreadyEscalatedToBDO)
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
        long count = supportRepository.countByComplaintId(c.getId());
        return ComplaintDTO.builder()
                .id(c.getId())
                .complaintToken(c.getComplaintToken())
                .title(c.getTitle() != null ? c.getTitle() : "No Title")
                .description(c.getDescription() != null ? c.getDescription() : "No Description")
                .category(c.getCategory() != null ? c.getCategory() : "GENERAL")
                .location(c.getLocation() != null ? c.getLocation() : "Unknown")
                .status(c.getStatus() != null ? c.getStatus().name() : "PENDING")
                .escalationLevel(c.getEscalationLevel() != null ? c.getEscalationLevel() : 0)
                .createdAt(c.getCreatedAt())
                .attachmentPath(attachmentUrl)
                .blockchainTxnId(c.getBlockchainTxnId())
                .supportCount(count)
                .build();
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

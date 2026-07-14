package com.pragati.service;

import com.pragati.dto.WorkProofDTO;
import com.pragati.entity.WorkProof;
import com.pragati.repository.WorkProofRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkProofService {

    private final WorkProofRepository workProofRepository;
    private final FileStorageService fileStorageService;

    // Submit Work Proof
    public WorkProof submitWorkProof(Long complaintId,
                                     String description,
                                     MultipartFile image,
                                     MultipartFile beforeImage) {

        try {

            String imageUrl = fileStorageService.save(image, "work-proofs");

            String beforeImageUrl = null;
            if (beforeImage != null && !beforeImage.isEmpty()) {
                beforeImageUrl = fileStorageService.save(beforeImage, "work-proofs");
            }

            WorkProof workProof = WorkProof.builder()
                    .complaintId(complaintId)
                    .description(description)
                    .imageUrl(imageUrl)
                    .beforeImageUrl(beforeImageUrl)
                    .build();

            return workProofRepository.save(workProof);

        } catch (Exception e) {
            log.error("Error submitting work proof", e);
            throw new RuntimeException("Could not submit work proof", e);
        }
    }

    // Submit and return DTO
    public WorkProofDTO submitWorkProofDTO(Long complaintId,
                                           String description,
                                           MultipartFile image,
                                           MultipartFile beforeImage) {

        WorkProof saved = submitWorkProof(
                complaintId,
                description,
                image,
                beforeImage
        );

        return mapToDTO(saved);
    }

    // Get all work proofs
    public List<WorkProofDTO> getAllWorkProofs() {

        return workProofRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Get work proof by complaint ID
    public WorkProofDTO getWorkProofByComplaintId(Long complaintId) {
        return workProofRepository.findByComplaintId(complaintId).stream()
                .findFirst()
                .map(this::mapToDTO)
                .orElse(null);
    }

    // Convert Entity to DTO
    private WorkProofDTO mapToDTO(WorkProof entity) {

        return WorkProofDTO.builder()
                .id(entity.getId())
                .complaintId(entity.getComplaintId())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .beforeImageUrl(entity.getBeforeImageUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
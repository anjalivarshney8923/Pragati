package com.pragati.service;

import com.pragati.entity.WorkProof;
import com.pragati.repository.WorkProofRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import com.pragati.dto.WorkProofDTO;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkProofService {

    private final WorkProofRepository workProofRepository;
    private final FileStorageService fileStorageService;
    private final BlockchainService blockchainService;

    public WorkProof submitWorkProof(Long complaintId, String description, MultipartFile image, MultipartFile beforeImage) {
        try {
            // 1. Generate Image Hash (Main/After)
            byte[] bytes = image.getBytes();
            String imageHash = generateSHA256(bytes);

            // 2. Save Image Files
            String imageUrl = fileStorageService.save(image, "work-proofs");
            String beforeImageUrl = null;
            if (beforeImage != null && !beforeImage.isEmpty()) {
                beforeImageUrl = fileStorageService.save(beforeImage, "work-proofs");
            }

            // 3. Post to Blockchain
            System.out.println("Calling blockchain for work proof submission...");

            Map<String, Object> blockchainData = new HashMap<>();
            blockchainData.put("type", "work_proof");
            blockchainData.put("imageHash", imageHash);
            blockchainData.put("description", description);
            if (complaintId != null) blockchainData.put("complaintId", complaintId);

            Map<String, String> result = blockchainService.storeComplaintHash(blockchainData);
            System.out.println("Blockchain response for work proof: " + result);

            String txnId = null;
            if (result != null) {
                // IMPORTANT: Fixed key from result.get("blockchainTxnId") to result.get("txnId")
                txnId = result.get("txnId");
            }

            // 4. Save to Repository
            WorkProof workProof = WorkProof.builder()
                    .complaintId(complaintId)
                    .description(description)
                    .imageUrl(imageUrl)
                    .beforeImageUrl(beforeImageUrl)
                    .blockchainHash(imageHash)
                    .blockchainTxnId(txnId)
                    .build();

            return workProofRepository.save(workProof);

        } catch (Exception e) {
            System.err.println("CRITICAL ERROR submitting work proof: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Could not process work proof submission", e);
        }
    }

    public WorkProofDTO submitWorkProofDTO(Long complaintId, String description, MultipartFile image, MultipartFile beforeImage) {
        WorkProof saved = submitWorkProof(complaintId, description, image, beforeImage);
        return mapToDTO(saved);
    }

    public List<WorkProofDTO> getAllWorkProofs() {
        System.out.println("Fetching all work proofs");
        try {
            return workProofRepository.findAllByOrderByCreatedAtDesc().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching work proofs");
        }
    }

    private WorkProofDTO mapToDTO(WorkProof entity) {
        return WorkProofDTO.builder()
                .id(entity.getId())
                .description(entity.getDescription() != null ? entity.getDescription() : "")
                .imageUrl(entity.getImageUrl())
                .beforeImageUrl(entity.getBeforeImageUrl())
                .blockchainTxnId(entity.getBlockchainTxnId() != null ? entity.getBlockchainTxnId() : "")
                .blockchainHash(entity.getBlockchainHash() != null ? entity.getBlockchainHash() : "")
                .createdAt(entity.getCreatedAt())
                .complaintId(entity.getComplaintId())
                .build();
    }

    public Map<String, Object> verifyWorkProof(Long id) {
        WorkProof proof = workProofRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work proof not found"));

        try {
            // 1. Recalculate hash from file
            // Assuming storage is local and URL starts with /uploads/
            String filePath = proof.getImageUrl().substring(1); // remove leading slash
            Path path = Paths.get(filePath);
            byte[] bytes = Files.readAllBytes(path);
            String currentHash = generateSHA256(bytes);

            // 2. Compare with stored blockchain_hash
            boolean verified = currentHash.equals(proof.getBlockchainHash());

            Map<String, Object> response = new HashMap<>();
            response.put("verified", verified);
            response.put("storedHash", proof.getBlockchainHash());
            response.put("currentHash", currentHash);
            response.put("txnId", proof.getBlockchainTxnId());
            
            return response;
        } catch (Exception e) {
            log.error("Error verifying work proof: {}", e.getMessage());
            throw new RuntimeException("Could not verify work proof", e);
        }
    }

    private String generateSHA256(byte[] bytes) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(bytes);
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}

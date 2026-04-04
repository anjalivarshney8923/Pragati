package com.pragati.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkProofDTO {
    private Long id;
    private Long complaintId;
    private String description;
    private String imageUrl;
    private String beforeImageUrl;
    private String blockchainTxnId;
    private String blockchainHash;
    private LocalDateTime createdAt;
}

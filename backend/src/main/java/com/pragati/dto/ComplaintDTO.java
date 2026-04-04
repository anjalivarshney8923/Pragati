package com.pragati.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String status;
    private String location;
    private String attachmentPath;
    private LocalDateTime createdAt;
    private String blockchainTxnId;
    private long supportCount;
}

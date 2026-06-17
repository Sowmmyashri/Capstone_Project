package com.example.moneytransfer.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

@Data
public class RewardResponse {
    private Long id;
    private String username;
    private UUID transactionId;
    private BigDecimal amount;
    private String description;
    private Timestamp createdOn;
}

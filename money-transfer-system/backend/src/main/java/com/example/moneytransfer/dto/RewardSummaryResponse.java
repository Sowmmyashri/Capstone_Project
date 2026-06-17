package com.example.moneytransfer.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RewardSummaryResponse {
    private String username;
    private BigDecimal totalRewards;
}

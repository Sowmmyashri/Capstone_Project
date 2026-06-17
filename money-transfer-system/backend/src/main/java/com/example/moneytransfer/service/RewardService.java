package com.example.moneytransfer.service;

import com.example.moneytransfer.domain.Account;
import com.example.moneytransfer.domain.User;
import com.example.moneytransfer.domain.entity.Reward;
import com.example.moneytransfer.domain.entity.TransactionLog;
import com.example.moneytransfer.domain.enums.TransactionStatus;
import com.example.moneytransfer.dto.RewardResponse;
import com.example.moneytransfer.dto.RewardSummaryResponse;
import com.example.moneytransfer.repository.AccountRepository;
import com.example.moneytransfer.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public void processReward(TransactionLog log) {
        if (log.getStatus() != TransactionStatus.SUCCESS) {
            return;
        }

        // Eligibility check
        if (log.getAmount().compareTo(new BigDecimal("100")) < 0) {
            return;
        }

        if (log.getFromAccountId().equals(log.getToAccountId())) {
            return; // No rewards for self-transfer
        }

        // Calculate points
        BigDecimal[] result = log.getAmount().divideAndRemainder(new BigDecimal("100"));
        BigDecimal points = result[0];

        if (points.compareTo(BigDecimal.ZERO) > 0) {
            Account sourceAccount = accountRepository.findById(log.getFromAccountId()).orElse(null);
            if (sourceAccount != null) {
                User user = sourceAccount.getUser();

                Reward reward = new Reward();
                reward.setUser(user);
                reward.setTransactionLog(log);
                reward.setAmount(points);
                reward.setDescription("Reward for transfer of " + log.getAmount());
                reward.setCreatedOn(Timestamp.from(Instant.now()));

                rewardRepository.save(reward);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<RewardResponse> getRewards(String username) {
        return rewardRepository.findByUserUsernameOrderByCreatedOnDesc(username).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RewardSummaryResponse getRewardSummary(String username) {
        BigDecimal total = rewardRepository.sumRewardsByUsername(username);
        if (total == null) {
            total = BigDecimal.ZERO;
        }

        RewardSummaryResponse response = new RewardSummaryResponse();
        response.setUsername(username);
        response.setTotalRewards(total);
        return response;
    }

    private RewardResponse toResponse(Reward reward) {
        RewardResponse response = new RewardResponse();
        response.setId(reward.getId());
        response.setUsername(reward.getUser().getUsername());
        response.setTransactionId(reward.getTransactionLog().getId());
        response.setAmount(reward.getAmount());
        response.setDescription(reward.getDescription());
        response.setCreatedOn(reward.getCreatedOn());
        return response;
    }
}

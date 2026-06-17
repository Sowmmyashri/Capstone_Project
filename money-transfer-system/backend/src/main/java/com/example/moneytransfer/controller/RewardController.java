package com.example.moneytransfer.controller;

import com.example.moneytransfer.dto.RewardResponse;
import com.example.moneytransfer.dto.RewardSummaryResponse;
import com.example.moneytransfer.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<List<RewardResponse>> getRewards(Principal principal) {
        return ResponseEntity.ok(rewardService.getRewards(principal.getName()));
    }

    @GetMapping("/summary")
    public ResponseEntity<RewardSummaryResponse> getRewardSummary(Principal principal) {
        return ResponseEntity.ok(rewardService.getRewardSummary(principal.getName()));
    }
}

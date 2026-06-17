package com.example.moneytransfer.repository;

import com.example.moneytransfer.domain.entity.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {

    List<Reward> findByUserUsernameOrderByCreatedOnDesc(String username);

    @Query("SELECT SUM(r.amount) FROM Reward r WHERE r.user.username = :username")
    BigDecimal sumRewardsByUsername(String username);
}

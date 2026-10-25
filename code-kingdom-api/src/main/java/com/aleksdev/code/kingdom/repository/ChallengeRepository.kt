package com.aleksdev.code.kingdom.repository

import com.aleksdev.code.kingdom.model.Challenge
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ChallengeRepository : JpaRepository<Challenge, Long> {
    fun findByChallengeId(challengeId: String): Challenge?
    fun findByModuleId(moduleId: Long): List<Challenge>
}


package com.aleksdev.code.kingdom.service

import com.aleksdev.code.kingdom.dto.CodeSubmissionResponse
import com.aleksdev.code.kingdom.dto.GameStateResponse
import com.aleksdev.code.kingdom.model.User
import com.aleksdev.code.kingdom.repository.UserRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class GameService(
    private val userRepository: UserRepository,
    private val moduleService: ModuleService
) {

    private val logger = KotlinLogging.logger {}

    fun getUserByUsername(username: String): User =
        userRepository.findByUsername(username)
            ?: throw IllegalArgumentException("User with username $username not found")

    fun getGameState(username: String): GameStateResponse {
        val user = getUserByUsername(username)
        logger.debug { "User founded: $user" }
        return GameStateResponse(
            xp = user.xp,
            level = user.level,
            coins = user.coins,
            buildings = user.buildings,
            unlockedModules = user.unlockedModules,
            completedChallenges = user.completedChallenges
        )
    }

    @Transactional
    fun submitCode(username: String, challengeId: String, code: String): CodeSubmissionResponse {
        val user = getUserByUsername(username)

        // Validate code
        val isValid = moduleService.validateChallenge(challengeId, code)
        if (!isValid) {
            return CodeSubmissionResponse(
                success = false,
                message = "Not quite right. Check the hint and try again!",
                xpEarned = 0,
                coinsEarned = 0,
                newBuilding = null,
                gameState = getGameState(username)
            )
        }

        // Check if already completed
        if (user.completedChallenges.contains(challengeId)) {
            return CodeSubmissionResponse(
                success = true,
                message = "Correct! (Already completed)",
                xpEarned = 0,
                coinsEarned = 0,
                newBuilding = null,
                gameState = getGameState(username)
            )
        }

        // Get rewards
        val (xpReward, coinReward) = moduleService.getChallengeRewards(challengeId)
            ?: return CodeSubmissionResponse(
                success = false,
                message = "Challenge not found.",
                xpEarned = 0,
                coinsEarned = 0,
                newBuilding = null,
                gameState = getGameState(username)
            )

        // Update user
        user.xp += xpReward
        user.coins += coinReward
        user.completedChallenges.add(challengeId)

        // Check for level up
        val xpForNextLevel = user.level * 200
        if (user.xp >= xpForNextLevel) {
            user.level++
        }

        // Check for new building
        val newBuilding: String? = moduleService.getModuleForChallenge(challengeId)
            ?.takeIf { it.building !in user.buildings }
            ?.also { user.buildings.add(it.building) }
            ?.building

        // Unlock modules based on XP threshold
        val allModules = moduleService.getAllModules()
        allModules
            .filter { it.xpRequired <= user.xp && it.id !in user.unlockedModules }
            .forEach { user.unlockedModules.add(it.id) }

        userRepository.save(user)

        return CodeSubmissionResponse(
            success = true,
            message = "Perfect! Challenge completed!",
            xpEarned = xpReward,
            coinsEarned = coinReward,
            newBuilding = newBuilding,
            gameState = getGameState(username)
        )
    }
}
package com.aleksdev.code.kingdom.service

import com.aleksdev.code.kingdom.dto.ChallengeResponse
import com.aleksdev.code.kingdom.dto.ModuleResponse
import com.aleksdev.code.kingdom.model.Module
import com.aleksdev.code.kingdom.repository.ChallengeRepository
import com.aleksdev.code.kingdom.repository.ModuleRepository
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service

@Service
class ModuleService(
    private val moduleRepository: ModuleRepository,
    private val challengeRepository: ChallengeRepository,
    private val objectMapper: ObjectMapper
) {

    fun getModule(moduleId: String): Module? = moduleRepository.findByModuleId(moduleId)

    fun getAllModules(): List<ModuleResponse> {
        return moduleRepository.findAllByOrderByXpRequiredAsc().map { module ->
            ModuleResponse(
                id = module.moduleId,
                name = module.name,
                description = module.description,
                xpRequired = module.xpRequired,
                building = module.building,
                challenges = module.challenges.map { challenge ->
                    ChallengeResponse(
                        id = challenge.challengeId,
                        title = challenge.title,
                        description = challenge.description,
                        hint = challenge.hint,
                        starter = challenge.starter,
                        xpReward = challenge.xpReward,
                        coinReward = challenge.coinReward
                    )
                }
            )
        }
    }

    fun validateChallenge(challengeId: String, code: String): Boolean {
        val challenge = challengeRepository.findByChallengeId(challengeId) ?: return false

        return try {
            val validationRules: JsonNode = objectMapper.readTree(challenge.validationRules)
            val checks = validationRules.get("checks")

            if (checks != null && checks.isArray) {
                checks.all { checkNode ->
                    code.contains(checkNode.asText())
                }
            } else {
                false
            }
        } catch (e: Exception) {
            // If validation rules are malformed, return false
            false
        }
    }

    fun getChallengeRewards(challengeId: String): Pair<Int, Int>? {
        return challengeRepository.findByChallengeId(challengeId)
            ?.let { Pair(it.xpReward, it.coinReward) }
    }

    fun getModuleForChallenge(challengeId: String): Module? {
        val challenge = challengeRepository.findByChallengeId(challengeId) ?: return null
        return challenge.module
    }
}
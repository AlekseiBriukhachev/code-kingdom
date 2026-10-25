package com.aleksdev.code.kingdom.dto

data class ModuleResponse(
    val id: String,
    val name: String,
    val description: String,
    val xpRequired: Int,
    val building: String,
    val challenges: List<ChallengeResponse>
)

package com.aleksdev.code.kingdom.dto

data class CodeSubmissionResponse(
    val success: Boolean,
    val message: String,
    val xpEarned: Int,
    val coinsEarned: Int,
    val newBuilding: String?,
    val gameState: GameStateResponse
)

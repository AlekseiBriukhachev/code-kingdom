package com.aleksdev.code.kingdom.dto

data class GameStateResponse(
    val xp: Int,
    val level: Int,
    val coins: Int,
    val buildings: List<String>,
    val unlockedModules: List<String>,
    val completedChallenges: List<String>
)

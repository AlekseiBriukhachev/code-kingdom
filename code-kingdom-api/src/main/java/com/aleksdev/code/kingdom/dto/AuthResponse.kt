package com.aleksdev.code.kingdom.dto

data class AuthResponse(
    val token: String,
    val username: String,
    val email: String,
    val role: String,
    val xp: Int = 0,
    val level: Int = 1,
    val coins: Int = 0,
    val buildings: List<String> = emptyList(),
    val unlockedModules: List<String> = emptyList(),
    val completedChallenges: List<String> = emptyList()
)

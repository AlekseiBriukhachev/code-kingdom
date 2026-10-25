package com.aleksdev.code.kingdom.dto

data class ChallengeResponse(
    val id: String,
    val title: String,
    val description: String,
    val hint: String,
    val starter: String,
    val xpReward: Int,
    val coinReward: Int
)

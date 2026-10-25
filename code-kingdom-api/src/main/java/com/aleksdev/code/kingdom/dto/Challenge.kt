package com.aleksdev.code.kingdom.dto

data class Challenge(
    val id: String,
    val title: String,
    val description: String,
    val hint: String,
    val starter: String,
    val xpReward: Int,
    val coinReward: Int,
    val validation: (String) -> Boolean
)

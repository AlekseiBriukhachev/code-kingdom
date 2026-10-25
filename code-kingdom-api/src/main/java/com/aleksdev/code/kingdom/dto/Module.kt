package com.aleksdev.code.kingdom.dto

data class Module(
    val id: String,
    val name: String,
    val icon: String,
    val description: String,
    val xpRequired: Int,
    val building: String,
    val challenges: List<Challenge>
)
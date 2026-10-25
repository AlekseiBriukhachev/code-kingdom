package com.aleksdev.code.kingdom.dto

data class CodeSubmissionRequest(
    val username: String,
    val challengeId: String,
    val code: String
)

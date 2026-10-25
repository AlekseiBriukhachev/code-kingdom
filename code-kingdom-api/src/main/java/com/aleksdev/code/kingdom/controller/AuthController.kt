package com.aleksdev.code.kingdom.controller

import com.aleksdev.code.kingdom.dto.AuthResponse
import com.aleksdev.code.kingdom.dto.GameStateResponse
import com.aleksdev.code.kingdom.dto.LoginRequest
import com.aleksdev.code.kingdom.dto.RegisterRequest
import com.aleksdev.code.kingdom.service.AuthService
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {
    private val logger = KotlinLogging.logger {}

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        logger.info { "Register request received for email: ${request.email}, username: ${request.username}" }
        val authResponse = authService.register(request)
        logger.info { "Register successful for username: ${authResponse.username}" }
        return ResponseEntity.ok(authResponse)
            .also { logger.info { "############register: $authResponse#########" } }
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        logger.info { "Login request received for email: ${request.email}" }
        logger.debug { "Login request body: $request" }
        try {
            val authResponse = authService.login(request)
            logger.info { "Login successful for email: ${request.email}" }
            return ResponseEntity.ok(authResponse)
                .also { logger.info { "##############logging: $authResponse" } }
        } catch (e: Exception) {
            logger.error { "Login failed for email: ${request.email}, error: ${e.message}" }
            throw e
        }
    }

    @GetMapping("/me")
    fun getCurrencyUser(): ResponseEntity<GameStateResponse> {
        logger.info { "Get current user state requested" }
        return ResponseEntity.ok(authService.getCurrencyUserState())
    }
}
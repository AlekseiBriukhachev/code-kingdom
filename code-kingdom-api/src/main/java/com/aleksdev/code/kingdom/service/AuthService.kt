package com.aleksdev.code.kingdom.service

import com.aleksdev.code.kingdom.dto.AuthResponse
import com.aleksdev.code.kingdom.dto.GameStateResponse
import com.aleksdev.code.kingdom.dto.LoginRequest
import com.aleksdev.code.kingdom.dto.RegisterRequest
import com.aleksdev.code.kingdom.model.Role
import com.aleksdev.code.kingdom.model.User
import com.aleksdev.code.kingdom.repository.UserRepository
import com.aleksdev.code.kingdom.security.JwtService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val authenticationManager: AuthenticationManager,
    private val gameService: GameService
) {
    private val logger = KotlinLogging.logger {}

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.findByUsername(request.username) != null) {
            throw IllegalArgumentException("Username ${request.username} already exists")
        }

        if (userRepository.findByEmail(request.email) != null) {
            throw IllegalArgumentException("Email ${request.email} already exists")
        }

        val user = User(
            username = request.username,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            role = Role.USER
        )

        val savedUser = userRepository.save(user)
        val token = jwtService.generateToken(savedUser)

        return AuthResponse(
            token = token,
            username = savedUser.username,
            email = savedUser.email,
            role = savedUser.role.name,
            xp = savedUser.xp,
            level = savedUser.level,
            coins = savedUser.coins,
            buildings = savedUser.buildings,
            unlockedModules = savedUser.unlockedModules,
            completedChallenges = savedUser.completedChallenges
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("Invalid credentials for email: ${request.email}")

        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                user.username,
                request.password
            )
        )

        user.lastLoginAt = LocalDateTime.now()
        userRepository.save(user)

        val token = jwtService.generateToken(user)

        return AuthResponse(
            token = token,
            username = user.username,
            email = user.email,
            role = user.role.name,
            xp = user.xp,
            level = user.level,
            coins = user.coins,
            buildings = user.buildings,
            unlockedModules = user.unlockedModules,
            completedChallenges = user.completedChallenges
        )
    }

    fun getCurrencyUserState(): GameStateResponse {
        val username = SecurityContextHolder.getContext().authentication.name
        return gameService.getGameState(username)
    }
}
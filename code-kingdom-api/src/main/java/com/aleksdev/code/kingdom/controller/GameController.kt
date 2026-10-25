package com.aleksdev.code.kingdom.controller

import com.aleksdev.code.kingdom.dto.CodeSubmissionRequest
import com.aleksdev.code.kingdom.dto.CodeSubmissionResponse
import com.aleksdev.code.kingdom.dto.CreateUserRequest
import com.aleksdev.code.kingdom.dto.GameStateResponse
import com.aleksdev.code.kingdom.dto.ModuleResponse
import com.aleksdev.code.kingdom.service.GameService
import com.aleksdev.code.kingdom.service.ModuleService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GameController(
    private val gameService: GameService,
    private val moduleService: ModuleService
) {

    private val logger = KotlinLogging.logger {}

    @GetMapping("/game-state/{username}")
    @PreAuthorize("#username == authentication.principal.username")
    fun getGameState(@PathVariable username: String): ResponseEntity<GameStateResponse> =
        ResponseEntity.ok(gameService.getGameState(username))
            .also { logger.info { "Resposed for user: $username" } }

    @GetMapping("/modules")
    fun getAllModules(): ResponseEntity<List<ModuleResponse>> =
        ResponseEntity.ok(moduleService.getAllModules())

    @PostMapping("/submit")
    fun submitCode(
        @RequestBody request: CodeSubmissionRequest,
        @AuthenticationPrincipal userDetails: UserDetails
        ): ResponseEntity<CodeSubmissionResponse> {

        if (request.username != userDetails.username) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        return ResponseEntity.ok(
            gameService.submitCode(
                request.username,
                request.challengeId,
                request.code
            )
        )
    }
}
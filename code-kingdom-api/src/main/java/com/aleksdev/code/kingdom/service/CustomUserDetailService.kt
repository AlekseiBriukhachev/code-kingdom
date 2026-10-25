package com.aleksdev.code.kingdom.service

import com.aleksdev.code.kingdom.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailService(
    private val userRepository: UserRepository
) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails? =
        userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found: $username")
}
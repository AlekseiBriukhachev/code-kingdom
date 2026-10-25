package com.aleksdev.code.kingdom.model

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.Table
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(unique = true, nullable = false)
    private val username: String,

    @Column(unique = true, nullable = false)
    val email: String,

    @Column(nullable = false)
    private var password: String,

    @Enumerated(EnumType.STRING)
    var role: Role = Role.USER,

    var enabled: Boolean = true,

    var xp: Int = 0,
    var level: Int = 1,
    var coins: Int = 0,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_buildings", joinColumns = [JoinColumn(name = "user_id")])
    @Column(name = "building")
    var buildings: MutableList<String> = mutableListOf(),

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_unlocked_modules", joinColumns = [JoinColumn(name = "user_id")])
    @Column(name = "module_id")
    var unlockedModules: MutableList<String> = mutableListOf("basics"),

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_completed_challenges", joinColumns = [JoinColumn(name = "user_id")])
    @Column(name = "challenge_id")
    var completedChallenges: MutableList<String> = mutableListOf(),

    val createdAt: LocalDateTime = LocalDateTime.now(),
    var lastLoginAt: LocalDateTime? = null
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority?> =
        mutableListOf(SimpleGrantedAuthority("ROLE_${role.name}"))

    override fun getPassword(): String = password

    override fun getUsername(): String = username

    override fun isAccountNonExpired(): Boolean  = true

    override fun isAccountNonLocked(): Boolean = enabled

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = enabled
}

enum class Role {
    USER,
    PREMIUM,
    ADMIN
}
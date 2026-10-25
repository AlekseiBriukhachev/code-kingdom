package com.aleksdev.code.kingdom.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "challenges")
data class Challenge(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(unique = true, nullable = false)
    val challengeId: String,

    @Column(nullable = false)
    val title: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val hint: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val starter: String,

    @Column(nullable = false)
    val xpReward: Int = 0,

    @Column(nullable = false)
    val coinReward: Int = 0,

    @Column(nullable = false, columnDefinition = "TEXT")
    val validationRules: String = "", // JSON string with validation logic

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    val module: Module? = null
)


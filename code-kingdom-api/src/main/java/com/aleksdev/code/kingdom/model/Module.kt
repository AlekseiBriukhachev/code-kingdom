package com.aleksdev.code.kingdom.model

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "modules")
data class Module(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(unique = true, nullable = false)
    val moduleId: String,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String,

    @Column(nullable = false)
    val xpRequired: Int = 0,

    @Column(nullable = false)
    val building: String,

    @OneToMany(
        mappedBy = "module",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    val challenges: List<Challenge> = mutableListOf()
)


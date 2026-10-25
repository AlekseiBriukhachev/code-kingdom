package com.aleksdev.code.kingdom.repository

import com.aleksdev.code.kingdom.model.Module
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ModuleRepository : JpaRepository<Module, Long> {
    fun findByModuleId(moduleId: String): Module?
    fun findAllByOrderByXpRequiredAsc(): List<Module>
}


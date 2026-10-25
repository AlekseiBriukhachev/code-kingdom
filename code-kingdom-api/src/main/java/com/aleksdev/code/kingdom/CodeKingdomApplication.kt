package com.aleksdev.code.kingdom

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.runApplication
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

@SpringBootApplication
class CodeKingdomApplication: SpringBootServletInitializer() {

    override fun configure(builder: SpringApplicationBuilder): SpringApplicationBuilder {
        return configureApplication(builder)
    }

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            runApplication<CodeKingdomApplication>(*args)
        }

        private fun configureApplication(builder: SpringApplicationBuilder): SpringApplicationBuilder {
            return builder.sources(CodeKingdomApplication::class.java)
        }
    }
}
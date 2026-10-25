package com.aleksdev.code.kingdom.config

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.servlet.Filter
import jakarta.servlet.FilterChain
import jakarta.servlet.FilterConfig
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Configuration
import org.springframework.stereotype.Component
import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper

@Component
class RequestResponseLoggingFilter : Filter {
    private val logger = KotlinLogging.logger {}

    override fun init(filterConfig: FilterConfig?) {
        // Initialization code if needed
    }

    override fun doFilter(
        servletRequest: ServletRequest?,
        servletResponse: ServletResponse?,
        filterChain: FilterChain?
    ) {
        val request = servletRequest as HttpServletRequest
        val response = servletResponse as HttpServletResponse

        // Skip logging for static resources and health endpoints
        if (shouldSkipLogging(request.requestURI)) {
            filterChain?.doFilter(request, response)
            return
        }

        val cachingRequest = ContentCachingRequestWrapper(request)
        val cachingResponse = ContentCachingResponseWrapper(response)

        try {
            logger.debug {
                ">>> REQUEST: ${request.method} ${request.requestURI}" +
                        " | Content-Type: ${request.contentType}" +
                        " | Headers: ${getHeadersAsString(request)}"
            }

            filterChain?.doFilter(cachingRequest, cachingResponse)

            val requestBody = getRequestBody(cachingRequest)
            if (requestBody.isNotEmpty() && isJsonContent(request.contentType)) {
                logger.debug { ">>> REQUEST BODY: $requestBody" }
            }

            logger.debug {
                "<<< RESPONSE: ${response.status}" +
                        " | Content-Type: ${cachingResponse.contentType}" +
                        " | URI: ${request.requestURI}"
            }

            val responseBody = getResponseBody(cachingResponse)
            if (responseBody.isNotEmpty()) {
                logger.debug { "<<< RESPONSE BODY: $responseBody" }
            }

            cachingResponse.copyBodyToResponse()
        } catch (e: Exception) {
            logger.error(e) { "Error in request/response logging filter" }
            throw e
        }
    }

    override fun destroy() {
        // Cleanup code if needed
    }

    private fun shouldSkipLogging(uri: String): Boolean {
        val skipPatterns = listOf(
            "/actuator",
            "/h2-console",
            "/.css",
            "/.js",
            "/.png",
            "/.jpg",
            "/.gif",
            "/.svg"
        )
        return skipPatterns.any { uri.contains(it) }
    }

    private fun getHeadersAsString(request: HttpServletRequest): String {
        return request.headerNames.toList()
            .filter { !it.equals("authorization", ignoreCase = true) }
            .joinToString(", ") { "$it=${request.getHeader(it)}" }
            .take(200)
    }

    private fun getRequestBody(request: ContentCachingRequestWrapper): String {
        val contentAsByteArray = request.contentAsByteArray
        return if (contentAsByteArray.isNotEmpty()) {
            String(contentAsByteArray, Charsets.UTF_8)
        } else {
            ""
        }
    }

    private fun getResponseBody(response: ContentCachingResponseWrapper): String {
        val contentAsByteArray = response.contentAsByteArray
        return if (contentAsByteArray.isNotEmpty()) {
            String(contentAsByteArray, Charsets.UTF_8).take(1000) // Limit to 1000 chars
        } else {
            ""
        }
    }

    private fun isJsonContent(contentType: String?): Boolean {
        return contentType?.contains("application/json", ignoreCase = true) == true
    }
}


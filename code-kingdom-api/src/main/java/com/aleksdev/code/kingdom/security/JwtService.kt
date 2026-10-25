package com.aleksdev.code.kingdom.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.security.Key
import java.util.Date

@Service
class JwtService {
    @Value("\${app.jwt.secret}")
    private lateinit var jwtSecret: String

    @Value("\${app.jwt.expiration}")
    private var jwtExpirationMs: Long = 864000000

    fun extractUsername(token: String): String =
        extractClaim(token, Claims::getSubject)

    fun <T> extractClaim(token: String, claimsResolver: (Claims) -> T): T {
        val claims = extractAllClaims(token)
        return claimsResolver(claims)
    }

    fun generateToken(userDetails: UserDetails): String =
        generateToken(emptyMap(), userDetails)

    fun generateToken(extraClaims: Map<String, Any>, userDetails: UserDetails): String =
        buildToken(extraClaims, userDetails, jwtExpirationMs)

    private fun buildToken(
        extraClaims: Map<String, Any>,
        userDetails: UserDetails,
        expiration: Long
    ): String = Jwts
        .builder()
        .subject(userDetails.username)
        .claims(extraClaims)
        .issuedAt(Date(System.currentTimeMillis()))
        .expiration(Date(System.currentTimeMillis() + expiration))
        .signWith(getSignInKey())
        .compact()

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return (username == userDetails.username) && !isTokenExpired(token)
    }

    private fun isTokenExpired(token: String): Boolean =
        extractExpiration(token).before(Date())

    private fun extractExpiration(token: String): Date =
        extractClaim(token, Claims::getExpiration)

    private fun extractAllClaims(token: String): Claims {
        val key = getSignInKey()
        @Suppress("DEPRECATION")
        return Jwts.parser()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body
    }

    private fun getSignInKey(): Key {
        val keyBytes = jwtSecret.toByteArray(Charsets.UTF_8)
        return Keys.hmacShaKeyFor(keyBytes)
    }

}
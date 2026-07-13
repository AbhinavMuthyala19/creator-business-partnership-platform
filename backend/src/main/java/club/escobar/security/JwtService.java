package club.escobar.security;

import club.escobar.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(SecurityUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getUsername())
                .claims(Map.of(
                        "uid", user.getId(),
                        "role", user.getRole(),
                        "type", "access"
                ))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(jwtProperties.accessTokenTtlMinutes() * 60)))
                .signWith(signingKey())
                .compact();
    }

    public String newRefreshTokenValue() {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject("refresh")
                .claims(Map.of("type", "refresh"))
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(jwtProperties.refreshTokenTtlDays() * 24 * 3600)))
                .id(java.util.UUID.randomUUID().toString())
                .signWith(signingKey())
                .compact();
    }

    public Instant refreshTokenExpiry() {
        return Instant.now().plusSeconds(jwtProperties.refreshTokenTtlDays() * 24 * 3600);
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isExpired(String token) {
        try {
            return parseClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}

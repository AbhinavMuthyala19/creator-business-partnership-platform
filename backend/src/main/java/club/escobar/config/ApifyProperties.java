package club.escobar.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.apify")
public record ApifyProperties(String baseUrl, String actorId, String token, long timeoutMs) {
}

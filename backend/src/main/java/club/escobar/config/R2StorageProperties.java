package club.escobar.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.storage.r2")
public record R2StorageProperties(
        String accountId,
        String bucket,
        String accessKey,
        String secretKey,
        String publicBaseUrl
) {
}

package club.escobar.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(
        String uploadDir,
        String baseUrl,
        long maxFileSizeBytes,
        List<String> allowedImageTypes,
        List<String> allowedVideoTypes,
        List<String> allowedDocumentTypes
) {
}

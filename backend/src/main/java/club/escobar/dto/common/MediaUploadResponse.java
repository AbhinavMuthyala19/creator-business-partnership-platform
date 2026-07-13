package club.escobar.dto.common;

public record MediaUploadResponse(
        String url,
        String contentType,
        long sizeBytes
) {
}

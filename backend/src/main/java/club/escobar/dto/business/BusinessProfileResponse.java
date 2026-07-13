package club.escobar.dto.business;

import java.time.Instant;

public record BusinessProfileResponse(
        Long id,
        Long userId,
        String companyName,
        String industry,
        String description,
        String logoUrl,
        String website,
        Instant createdAt
) {
}

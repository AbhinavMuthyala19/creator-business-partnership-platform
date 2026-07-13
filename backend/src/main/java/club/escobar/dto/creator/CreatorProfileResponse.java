package club.escobar.dto.creator;

import java.time.Instant;
import java.util.List;

public record CreatorProfileResponse(
        Long id,
        Long userId,
        String email,
        String displayName,
        String bio,
        String niche,
        Long followerCount,
        List<String> socialLinks,
        List<String> portfolioLinks,
        Instant createdAt
) {
}

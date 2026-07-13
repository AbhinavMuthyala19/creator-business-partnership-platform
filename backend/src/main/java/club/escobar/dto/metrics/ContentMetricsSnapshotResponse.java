package club.escobar.dto.metrics;

import java.time.Instant;

public record ContentMetricsSnapshotResponse(
        Long id,
        Long contentId,
        Long likeCount,
        Long commentCount,
        Long viewCount,
        Instant fetchedAt
) {
}

package club.escobar.dto.metrics;

public record LeaderboardEntryResponse(
        int rank,
        Long creatorId,
        String creatorDisplayName,
        Long totalViews,
        Long publishedContentCount
) {
}

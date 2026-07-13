package club.escobar.integration.apify;

/**
 * Normalized result of a single Instagram post scrape. viewCount is null when Apify
 * reported no view metric at all (typical for photo posts, as opposed to video/reel posts) -
 * distinct from a genuine zero, which callers should treat as an actual reported zero.
 */
public record ApifyPostMetrics(Long likeCount, Long commentCount, Long viewCount, String rawJson) {
}

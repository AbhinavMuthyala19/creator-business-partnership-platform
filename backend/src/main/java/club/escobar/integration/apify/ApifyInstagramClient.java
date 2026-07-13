package club.escobar.integration.apify;

/**
 * Abstraction over fetching public Instagram post metrics via Apify's Instagram scraper actor.
 * Uses Apify's unofficial scraper, not Meta's Graph API - same ToS caveat as the Instagram
 * data-fetch pattern this was adapted from.
 */
public interface ApifyInstagramClient {

    ApifyPostMetrics fetchPostMetrics(String postUrl);
}

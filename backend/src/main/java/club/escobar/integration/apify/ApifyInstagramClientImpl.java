package club.escobar.integration.apify;

import club.escobar.config.ApifyProperties;
import club.escobar.exception.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
@RequiredArgsConstructor
public class ApifyInstagramClientImpl implements ApifyInstagramClient {

    private static final Logger log = LoggerFactory.getLogger(ApifyInstagramClientImpl.class);

    private final RestClient apifyRestClient;
    private final ApifyProperties properties;
    private final ObjectMapper objectMapper;

    @Override
    public ApifyPostMetrics fetchPostMetrics(String postUrl) {
        String rawBody;
        try {
            // Read the body as a raw string rather than letting RestClient pick a message
            // converter by Content-Type - Apify's run-sync-get-dataset-items endpoint has been
            // observed to respond with "application/octet-stream" even though the body is JSON,
            // which makes content-type-based JSON conversion fail even though the data is fine.
            rawBody = apifyRestClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/acts/{actorId}/run-sync-get-dataset-items")
                            .queryParam("token", properties.token())
                            .build(properties.actorId()))
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(ApifyRunInput.forSingleUrl(postUrl))
                    .retrieve()
                    .body(String.class);
        } catch (RestClientException e) {
            log.error("Apify request failed for postUrl={}", postUrl, e);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Failed to fetch Instagram post metrics");
        }

        JsonNode response;
        try {
            response = rawBody == null ? null : objectMapper.readTree(rawBody);
        } catch (Exception e) {
            log.error("Failed to parse Apify response for postUrl={}: {}", postUrl, rawBody, e);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Apify returned an unreadable response for this post");
        }

        if (response == null || !response.isArray() || response.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Apify returned no data for this post");
        }

        return mapToMetrics(response.get(0));
    }

    // Field names verified against a real actor response. Instagram exposes two different
    // view-like numbers for video/reel posts: videoPlayCount (total plays, including replays -
    // the number Instagram's own UI shows as the headline count) and videoViewCount (a smaller,
    // more conservative internal metric). We deliberately prefer videoPlayCount since that's
    // what creators/businesses actually see and expect "views" to mean.
    private ApifyPostMetrics mapToMetrics(JsonNode item) {
        long likeCount = item.path("likesCount").asLong(0);
        long commentCount = item.path("commentsCount").asLong(0);

        Long viewCount = null;
        if (item.hasNonNull("videoPlayCount")) {
            viewCount = item.get("videoPlayCount").asLong();
        } else if (item.hasNonNull("videoViewCount")) {
            viewCount = item.get("videoViewCount").asLong();
        }

        return new ApifyPostMetrics(likeCount, commentCount, viewCount, item.toString());
    }
}

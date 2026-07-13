package club.escobar.integration.apify;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record ApifyRunInput(
        @JsonProperty("resultsType") String resultsType,
        @JsonProperty("directUrls") List<String> directUrls,
        @JsonProperty("resultsLimit") int resultsLimit
) {
    public static ApifyRunInput forSingleUrl(String postUrl) {
        return new ApifyRunInput("posts", List.of(postUrl), 1);
    }
}

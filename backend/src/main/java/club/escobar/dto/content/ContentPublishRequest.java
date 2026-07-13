package club.escobar.dto.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContentPublishRequest(
        @NotBlank
        @Size(max = 500)
        @Pattern(
                regexp = "^https?://(www\\.)?instagram\\.com/(p|reel|reels)/[A-Za-z0-9_-]+/?(\\?.*)?$",
                message = "Must be a valid Instagram post or reel URL"
        )
        String postUrl
) {
}

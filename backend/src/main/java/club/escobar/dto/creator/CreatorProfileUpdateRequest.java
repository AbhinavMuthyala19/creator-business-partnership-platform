package club.escobar.dto.creator;

import jakarta.validation.constraints.*;

import java.util.List;

public record CreatorProfileUpdateRequest(
        @NotBlank @Size(max = 120) String displayName,
        @Size(max = 4000) String bio,
        @Size(max = 80) String niche,
        @NotNull @PositiveOrZero Long followerCount,
        @Size(max = 20) List<@NotBlank @Size(max = 500) String> socialLinks,
        @Size(max = 30) List<@NotBlank @Size(max = 500) String> portfolioLinks
) {
}

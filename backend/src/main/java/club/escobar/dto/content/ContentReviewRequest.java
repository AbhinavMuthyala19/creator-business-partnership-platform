package club.escobar.dto.content;

import club.escobar.entity.enums.ContentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContentReviewRequest(
        @NotNull ContentStatus decision,
        @Size(max = 2000) String note
) {
}

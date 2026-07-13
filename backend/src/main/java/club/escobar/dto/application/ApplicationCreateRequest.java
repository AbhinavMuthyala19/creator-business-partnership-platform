package club.escobar.dto.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationCreateRequest(
        @NotNull Long campaignId,
        @NotBlank @Size(max = 4000) String pitchMessage
) {
}

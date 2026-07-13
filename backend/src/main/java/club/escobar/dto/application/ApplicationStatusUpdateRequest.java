package club.escobar.dto.application;

import club.escobar.entity.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationStatusUpdateRequest(
        @NotNull ApplicationStatus status,
        @Size(max = 2000) String reviewNote
) {
}

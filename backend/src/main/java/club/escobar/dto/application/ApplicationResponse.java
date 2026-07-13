package club.escobar.dto.application;

import club.escobar.entity.enums.ApplicationStatus;

import java.time.Instant;

public record ApplicationResponse(
        Long id,
        Long creatorId,
        String creatorDisplayName,
        Long businessId,
        String businessCompanyName,
        String pitchMessage,
        ApplicationStatus status,
        String reviewNote,
        Instant appliedAt,
        Instant reviewedAt
) {
}

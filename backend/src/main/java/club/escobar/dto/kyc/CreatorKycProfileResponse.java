package club.escobar.dto.kyc;

import club.escobar.entity.enums.KycStatus;

import java.time.Instant;

public record CreatorKycProfileResponse(
        Long creatorId,
        String panNumberMasked,
        String nameOnPan,
        String documentUrl,
        KycStatus status,
        String reviewNote,
        Instant reviewedAt
) {
}

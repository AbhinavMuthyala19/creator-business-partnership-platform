package club.escobar.dto.kyc;

import club.escobar.entity.enums.KycStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreatorKycReviewRequest(
        @NotNull KycStatus status,
        @Size(max = 2000) String reviewNote
) {
}

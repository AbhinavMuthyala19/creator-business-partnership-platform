package club.escobar.dto.payout;

import club.escobar.entity.enums.PayoutStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record PayoutResponse(
        Long id,
        Long contentId,
        Long creatorId,
        Long campaignId,
        Long businessId,
        Long viewCountUsed,
        BigDecimal rateUsed,
        BigDecimal amountInr,
        PayoutStatus status,
        Instant calculatedAt,
        Instant eligibleAt,
        Instant paidAt,
        String paidNote
) {
}

package club.escobar.dto.campaign;

import club.escobar.entity.enums.CampaignStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record CampaignResponse(
        Long id,
        Long businessId,
        String businessCompanyName,
        String title,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal ratePerThousandViewsInr,
        CampaignStatus status,
        boolean acceptingApplications,
        Instant createdAt,
        Instant updatedAt
) {
}

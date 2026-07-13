package club.escobar.dto.content;

import club.escobar.entity.enums.ContentStatus;
import club.escobar.entity.enums.MediaType;

import java.time.Instant;
import java.util.List;

public record ContentResponse(
        Long id,
        Long applicationId,
        Long creatorId,
        String creatorDisplayName,
        Long campaignId,
        String campaignTitle,
        Long businessId,
        String businessCompanyName,
        String caption,
        String mediaUrl,
        MediaType mediaType,
        String postUrl,
        ContentStatus status,
        Integer version,
        List<ContentReviewNoteResponse> reviewNotes,
        Instant createdAt,
        Instant updatedAt,
        Instant submittedAt,
        Instant publishedAt
) {
}

package club.escobar.dto.content;

import club.escobar.entity.enums.ContentStatus;

import java.time.Instant;

public record ContentReviewNoteResponse(
        Long id,
        Long authoredByUserId,
        Integer contentVersion,
        ContentStatus decision,
        String noteText,
        Instant createdAt
) {
}

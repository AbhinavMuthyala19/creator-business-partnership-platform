package club.escobar.entity;

import club.escobar.entity.enums.ContentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "content_review_notes", indexes = {
        @Index(name = "idx_review_notes_content", columnList = "content_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentReviewNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "authored_by", nullable = false)
    private User authoredBy;

    // The content version this note was authored against, and the resulting status decision.
    @Column(name = "content_version", nullable = false)
    private Integer contentVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "decision", nullable = false, length = 20)
    private ContentStatus decision;

    @Column(name = "note_text", columnDefinition = "TEXT")
    private String noteText;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

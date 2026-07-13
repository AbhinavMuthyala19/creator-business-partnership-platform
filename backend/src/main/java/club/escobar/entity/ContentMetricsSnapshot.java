package club.escobar.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "content_metrics_snapshots", indexes = {
        @Index(name = "idx_content_metrics_snapshots_content", columnList = "content_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentMetricsSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(name = "like_count", nullable = false)
    @Builder.Default
    private Long likeCount = 0L;

    @Column(name = "comment_count", nullable = false)
    @Builder.Default
    private Long commentCount = 0L;

    // Null means Instagram/Apify reported no view metric for this post (typical for photo posts,
    // as opposed to video/reel posts) - distinct from a genuine zero.
    @Column(name = "view_count")
    private Long viewCount;

    @Column(name = "raw_payload", columnDefinition = "JSON")
    private String rawPayload;

    @CreationTimestamp
    @Column(name = "fetched_at", nullable = false, updatable = false)
    private Instant fetchedAt;
}

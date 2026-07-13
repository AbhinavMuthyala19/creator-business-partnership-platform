package club.escobar.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "creator_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatorProfile {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(name = "display_name", nullable = false, length = 120)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 80)
    private String niche;

    @Column(name = "follower_count")
    @Builder.Default
    private Long followerCount = 0L;

    @ElementCollection
    @CollectionTable(name = "creator_social_links", joinColumns = @JoinColumn(name = "creator_profile_id"))
    @Column(name = "url", length = 500)
    @Builder.Default
    private List<String> socialLinks = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "creator_portfolio_items", joinColumns = @JoinColumn(name = "creator_profile_id"))
    @Column(name = "url", length = 500)
    @Builder.Default
    private List<String> portfolioLinks = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

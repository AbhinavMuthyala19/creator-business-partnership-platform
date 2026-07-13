package club.escobar.entity;

import club.escobar.entity.enums.PayoutStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payouts", indexes = {
        @Index(name = "idx_payouts_creator", columnList = "creator_id"),
        @Index(name = "idx_payouts_campaign", columnList = "campaign_id"),
        @Index(name = "idx_payouts_business", columnList = "business_id"),
        @Index(name = "idx_payouts_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "content_id", nullable = false, unique = true)
    private Content content;

    // Denormalized off content/campaign at calculation time, same rationale as Content's
    // own creator/business denormalization - a business-wide payouts list filters by
    // business_id directly without joining through campaign.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private User business;

    @Column(name = "view_count_used", nullable = false)
    @Builder.Default
    private Long viewCountUsed = 0L;

    @Column(name = "rate_used", nullable = false, precision = 12, scale = 2)
    private BigDecimal rateUsed;

    @Column(name = "amount_inr", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal amountInr = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.BELOW_THRESHOLD;

    @UpdateTimestamp
    @Column(name = "calculated_at", nullable = false)
    private Instant calculatedAt;

    @Column(name = "eligible_at")
    private Instant eligibleAt;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "paid_note", columnDefinition = "TEXT")
    private String paidNote;
}

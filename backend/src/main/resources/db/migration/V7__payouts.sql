-- One mutable row per content item, recalculated in place on every metrics sync
-- (not an append-only log, unlike content_review_notes/content_metrics_snapshots).
CREATE TABLE payouts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id      BIGINT NOT NULL,
    creator_id      BIGINT NOT NULL,
    campaign_id     BIGINT NOT NULL,
    business_id     BIGINT NOT NULL,
    view_count_used BIGINT NOT NULL DEFAULT 0,
    rate_used       DECIMAL(12,2) NOT NULL,
    amount_inr      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status          VARCHAR(30)  NOT NULL DEFAULT 'BELOW_THRESHOLD',
    calculated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eligible_at     TIMESTAMP NULL,
    paid_at         TIMESTAMP NULL,
    paid_note       TEXT,
    CONSTRAINT fk_payouts_content  FOREIGN KEY (content_id)  REFERENCES content (id)   ON DELETE CASCADE,
    CONSTRAINT fk_payouts_creator  FOREIGN KEY (creator_id)  REFERENCES users (id)     ON DELETE CASCADE,
    CONSTRAINT fk_payouts_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE,
    CONSTRAINT fk_payouts_business FOREIGN KEY (business_id) REFERENCES users (id)     ON DELETE CASCADE,
    CONSTRAINT uk_payouts_content  UNIQUE (content_id)
) ENGINE=InnoDB;

CREATE INDEX idx_payouts_creator ON payouts (creator_id);
CREATE INDEX idx_payouts_campaign ON payouts (campaign_id);
CREATE INDEX idx_payouts_business ON payouts (business_id);
CREATE INDEX idx_payouts_status ON payouts (status);

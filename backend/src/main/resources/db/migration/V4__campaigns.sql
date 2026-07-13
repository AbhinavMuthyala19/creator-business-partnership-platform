CREATE TABLE campaigns (
    id                          BIGINT AUTO_INCREMENT PRIMARY KEY,
    business_id                 BIGINT       NOT NULL,
    title                       VARCHAR(150) NOT NULL,
    description                 TEXT,
    start_date                  DATE         NOT NULL,
    end_date                    DATE         NOT NULL,
    rate_per_thousand_views_inr DECIMAL(12,2) NOT NULL,
    status                      VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    created_at                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_campaigns_business FOREIGN KEY (business_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_campaigns_business ON campaigns (business_id);
CREATE INDEX idx_campaigns_status ON campaigns (status);
CREATE INDEX idx_campaigns_dates ON campaigns (start_date, end_date);

ALTER TABLE content
    ADD COLUMN post_url     VARCHAR(500) NULL AFTER media_type,
    ADD COLUMN published_at TIMESTAMP    NULL AFTER submitted_at;

CREATE TABLE content_metrics_snapshots (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id    BIGINT NOT NULL,
    like_count    BIGINT NOT NULL DEFAULT 0,
    comment_count BIGINT NOT NULL DEFAULT 0,
    view_count    BIGINT NULL,
    raw_payload   JSON NULL,
    fetched_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_content_metrics_snapshots_content FOREIGN KEY (content_id) REFERENCES content (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_content_metrics_snapshots_content ON content_metrics_snapshots (content_id);
CREATE INDEX idx_content_metrics_snapshots_content_fetched ON content_metrics_snapshots (content_id, fetched_at);

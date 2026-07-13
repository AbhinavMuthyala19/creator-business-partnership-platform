CREATE TABLE creator_kyc_profiles (
    id              BIGINT PRIMARY KEY,
    pan_number      VARCHAR(10)  NOT NULL,
    name_on_pan     VARCHAR(150) NOT NULL,
    document_url    VARCHAR(500) NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    reviewed_by     BIGINT NULL,
    review_note     TEXT,
    reviewed_at     TIMESTAMP NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_creator_kyc_profiles_user     FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_creator_kyc_profiles_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_creator_kyc_profiles_status ON creator_kyc_profiles (status);

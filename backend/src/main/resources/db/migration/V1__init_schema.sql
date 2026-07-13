CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users (role);

CREATE TABLE creator_profiles (
    id              BIGINT PRIMARY KEY,
    display_name    VARCHAR(120) NOT NULL,
    bio             TEXT,
    niche           VARCHAR(80),
    follower_count  BIGINT       NOT NULL DEFAULT 0,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_creator_profiles_user FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE creator_social_links (
    creator_profile_id BIGINT NOT NULL,
    url                 VARCHAR(500) NOT NULL,
    CONSTRAINT fk_creator_social_links_profile FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_creator_social_links_profile ON creator_social_links (creator_profile_id);

CREATE TABLE creator_portfolio_items (
    creator_profile_id BIGINT NOT NULL,
    url                 VARCHAR(500) NOT NULL,
    CONSTRAINT fk_creator_portfolio_items_profile FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_creator_portfolio_items_profile ON creator_portfolio_items (creator_profile_id);

CREATE TABLE business_profiles (
    id              BIGINT PRIMARY KEY,
    company_name    VARCHAR(150) NOT NULL,
    industry        VARCHAR(80),
    description     TEXT,
    logo_url        VARCHAR(500),
    website         VARCHAR(300),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_business_profiles_user FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_business_company_name ON business_profiles (company_name);
CREATE INDEX idx_business_industry ON business_profiles (industry);

CREATE TABLE applications (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    creator_id      BIGINT NOT NULL,
    business_id     BIGINT NOT NULL,
    pitch_message   TEXT   NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    review_note     TEXT,
    applied_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at     TIMESTAMP NULL,
    CONSTRAINT fk_applications_creator FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_business FOREIGN KEY (business_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uk_applications_creator_business UNIQUE (creator_id, business_id)
) ENGINE=InnoDB;

CREATE INDEX idx_applications_status ON applications (status);

CREATE TABLE content (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id  BIGINT NOT NULL,
    creator_id      BIGINT NOT NULL,
    business_id     BIGINT NOT NULL,
    caption         TEXT,
    media_url       VARCHAR(500) NOT NULL,
    media_type      VARCHAR(10)  NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    version         INT          NOT NULL DEFAULT 1,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    submitted_at    TIMESTAMP NULL,
    CONSTRAINT fk_content_application FOREIGN KEY (application_id) REFERENCES applications (id) ON DELETE CASCADE,
    CONSTRAINT fk_content_creator FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_content_business FOREIGN KEY (business_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_content_status ON content (status);

CREATE TABLE content_review_notes (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id      BIGINT NOT NULL,
    authored_by     BIGINT NOT NULL,
    content_version INT NOT NULL,
    decision        VARCHAR(20) NOT NULL,
    note_text       TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_notes_content FOREIGN KEY (content_id) REFERENCES content (id) ON DELETE CASCADE,
    CONSTRAINT fk_review_notes_author FOREIGN KEY (authored_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_review_notes_content ON content_review_notes (content_id);

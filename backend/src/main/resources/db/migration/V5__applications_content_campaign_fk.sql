-- Businesses now create campaigns; creators apply to a campaign, not directly to a business.
-- No production data exists yet, so this replaces the business_id FK directly rather than
-- backfilling a legacy campaign per business.

ALTER TABLE applications
    DROP FOREIGN KEY fk_applications_business,
    DROP INDEX uk_applications_creator_business,
    DROP COLUMN business_id,
    ADD COLUMN campaign_id BIGINT NOT NULL AFTER creator_id,
    ADD CONSTRAINT fk_applications_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE,
    ADD CONSTRAINT uk_applications_creator_campaign UNIQUE (creator_id, campaign_id);

CREATE INDEX idx_applications_campaign ON applications (campaign_id);

-- content keeps its existing denormalized business_id (unchanged) and gains a denormalized
-- campaign_id alongside it, for the same "query simplicity" reason business_id/creator_id exist.
ALTER TABLE content
    ADD COLUMN campaign_id BIGINT NOT NULL AFTER application_id,
    ADD CONSTRAINT fk_content_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE;

CREATE INDEX idx_content_campaign ON content (campaign_id);

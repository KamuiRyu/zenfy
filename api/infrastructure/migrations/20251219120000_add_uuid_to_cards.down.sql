-- +goose Down
-- Remove uuid column from cards
DROP INDEX IF EXISTS idx_cards_uuid;
ALTER TABLE cards DROP COLUMN IF EXISTS uuid;
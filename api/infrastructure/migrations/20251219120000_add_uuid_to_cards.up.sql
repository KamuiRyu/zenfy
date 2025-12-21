-- Add uuid column to cards
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS uuid VARCHAR(36);

-- Ensure uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_uuid ON cards(uuid);

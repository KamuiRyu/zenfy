-- Remove bank column from cards
ALTER TABLE cards
DROP COLUMN IF EXISTS bank;

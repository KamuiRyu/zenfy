-- Add bank column to cards
ALTER TABLE cards
ADD COLUMN IF NOT EXISTS bank VARCHAR(100);

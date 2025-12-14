-- Add uuid column to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS uuid VARCHAR(36);

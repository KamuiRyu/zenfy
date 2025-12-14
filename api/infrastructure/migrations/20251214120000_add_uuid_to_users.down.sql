-- Drop uuid column from users
ALTER TABLE users
DROP COLUMN IF EXISTS uuid;

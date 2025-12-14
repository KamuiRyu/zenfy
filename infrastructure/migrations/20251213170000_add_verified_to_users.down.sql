-- Drop verified column from users
ALTER TABLE users
DROP COLUMN IF EXISTS verified;

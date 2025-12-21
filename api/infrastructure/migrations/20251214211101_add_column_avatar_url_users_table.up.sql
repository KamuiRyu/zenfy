-- Write your UP SQL statements here
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255);

-- Add recurrence_interval column back to transactions table
ALTER TABLE transactions ADD COLUMN recurrence_interval INTEGER DEFAULT 1;
-- Add recurrence_start_date column to transactions table
ALTER TABLE transactions ADD COLUMN recurrence_start_date TIMESTAMPTZ;
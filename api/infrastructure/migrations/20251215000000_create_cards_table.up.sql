-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(100),
    last_four VARCHAR(4) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    card_type VARCHAR(20) NOT NULL CHECK (card_type IN ('credit', 'debit')),
    holder_name VARCHAR(255) NOT NULL,
    expiry_month INTEGER NOT NULL CHECK (expiry_month >= 1 AND expiry_month <= 12),
    expiry_year INTEGER NOT NULL,
    billing_day INTEGER NOT NULL CHECK (billing_day >= 1 AND billing_day <= 31),
    bank VARCHAR(100),
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user_id for faster lookups
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_uuid ON cards(uuid);

-- Create index for default cards
CREATE INDEX idx_cards_is_default ON cards(user_id, is_default) WHERE is_default = true;


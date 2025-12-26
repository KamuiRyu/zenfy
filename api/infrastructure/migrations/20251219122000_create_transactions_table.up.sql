-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(36) UNIQUE NOT NULL,
    card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount BIGINT NOT NULL, -- cents
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    kind VARCHAR(8) NOT NULL CHECK (kind IN ('debit','credit', 'deposit', 'withdrawal', 'transfer')),
    merchant VARCHAR(255),
    description TEXT,
    metadata JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Recurring fields
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurrence_type VARCHAR(20),
    recurrence_interval INTEGER DEFAULT 1,
    recurrence_end_date TIMESTAMPTZ,

    -- Installment fields
    is_installment BOOLEAN NOT NULL DEFAULT false,
    installment_number INTEGER,
    total_installments INTEGER,
);

-- Indexes
CREATE INDEX idx_transactions_card_id ON transactions(card_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_occurred_at ON transactions(occurred_at);
CREATE INDEX idx_transactions_uuid ON transactions(uuid);
CREATE INDEX idx_transactions_is_recurring ON transactions(is_recurring) WHERE is_recurring = true;
CREATE INDEX idx_transactions_is_installment ON transactions(is_installment) WHERE is_installment = true;
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
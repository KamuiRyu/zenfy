-- +migrate Up
CREATE TABLE invalid_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_invalid_tokens_token ON invalid_tokens(token);
CREATE INDEX idx_invalid_tokens_user_id ON invalid_tokens(user_id);
CREATE INDEX idx_invalid_tokens_expires_at ON invalid_tokens(expires_at);
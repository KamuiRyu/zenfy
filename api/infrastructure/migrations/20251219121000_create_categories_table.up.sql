-- +goose Up
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'expense' CHECK (type IN ('expense', 'income', 'investment', 'transfer')),
    description TEXT,
    color VARCHAR(7), -- Hex color like #FF5733
    icon VARCHAR(50), -- Icon name or emoji
    image TEXT, -- Image URL or path
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_uuid ON categories(uuid);

INSERT INTO categories (user_id, name, type, description, color, icon, is_default) VALUES
(NULL, 'Alimentação', 'expense', 'Restaurantes, mercados, delivery', '#FF6B6B', '🍽️', TRUE),
(NULL, 'Transporte', 'expense', 'Uber, ônibus, gasolina, estacionamento', '#4ECDC4', '🚗', TRUE),
(NULL, 'Saúde', 'expense', 'Farmácias, médicos, dentistas, planos', '#45B7D1', '🏥', TRUE),
(NULL, 'Educação', 'expense', 'Cursos, livros, materiais escolares', '#96CEB4', '📚', TRUE),
(NULL, 'Lazer', 'expense', 'Cinema, shows, jogos, hobbies', '#FFEAA7', '🎬', TRUE),
(NULL, 'Compras', 'expense', 'Roupas, eletrônicos, casa e jardim', '#DDA0DD', '🛍️', TRUE),
(NULL, 'Contas', 'expense', 'Luz, água, telefone, internet', '#FF7675', '💡', TRUE),
(NULL, 'Assinaturas', 'expense', 'Netflix, Spotify, revistas', '#A29BFE', '📺', TRUE),
(NULL, 'Investimentos', 'investment', 'Ações, fundos, criptomoedas', '#00B894', '📈', TRUE),
(NULL, 'Salário', 'income', 'Salário, rendimentos, freelance', '#00B894', '💰', TRUE),
(NULL, 'Outros', 'expense', 'Outras despesas não categorizadas', '#636E72', '📝', TRUE);

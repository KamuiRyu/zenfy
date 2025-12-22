-- +goose Up
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'expense' CHECK (type IN ('expense', 'income', 'investment', 'transfer')),
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_uuid ON categories(uuid);

INSERT INTO categories (user_id, name, type, description, color, icon, is_default) VALUES
(NULL, 'Refeições', 'expense', 'Alimentação, restaurantes, delivery e supermercados', '#FF6B6B', 'utensils', TRUE),
(NULL, 'Transporte', 'expense', 'Transporte público, combustível e manutenção veicular', '#4ECDC4', 'car', TRUE),
(NULL, 'Saúde', 'expense', 'Consultas médicas, medicamentos e planos de saúde', '#45B7D1', 'hospital', TRUE),
(NULL, 'Educação', 'expense', 'Cursos, livros e materiais educacionais', '#96CEB4', 'book', TRUE),
(NULL, 'Entretenimento', 'expense', 'Cinema, shows, hobbies e atividades recreativas', '#FFEAA7', 'film', TRUE),
(NULL, 'Compras', 'expense', 'Roupas, eletrônicos e itens pessoais', '#DDA0DD', 'shopping-bag', TRUE),
(NULL, 'Serviços Públicos', 'expense', 'Luz, água, telefone, internet e gás', '#FF7675', 'lightbulb', TRUE),
(NULL, 'Netflix', 'expense', 'Assinatura do serviço de streaming Netflix', '#E50914', 'netflix', TRUE),
(NULL, 'Spotify', 'expense', 'Assinatura do serviço de música Spotify', '#1DB954', 'spotify', TRUE),
(NULL, 'Amazon Prime', 'expense', 'Assinatura do Amazon Prime Video', '#FF9900', 'amazon-prime', TRUE),
(NULL, 'Disney+', 'expense', 'Assinatura do Disney+', '#113CCF', 'tv', TRUE),
(NULL, 'HBO Max', 'expense', 'Assinatura do HBO Max', '#000000', 'hbo', TRUE),
(NULL, 'Apple Music', 'expense', 'Assinatura do Apple Music', '#FC3C44', 'apple-music', TRUE),
(NULL, 'YouTube Premium', 'expense', 'Assinatura do YouTube Premium', '#FF0000', 'youtubemusic', TRUE),
(NULL, 'Outras Assinaturas', 'expense', 'Outras assinaturas e serviços de streaming', '#A29BFE', 'tv', TRUE),
(NULL, 'Investimentos', 'investment', 'Ações, fundos, criptomoedas e aplicações', '#00B894', 'chart-line', TRUE),
(NULL, 'Renda', 'income', 'Salário, rendimentos e trabalhos freelance', '#00B894', 'money-bill', TRUE),
(NULL, 'Imprevistos', 'expense', 'Despesas não planejadas e emergências', '#636E72', 'exclamation-triangle', TRUE),
(NULL, 'Casa', 'expense', 'Aluguel, condomínio, reformas e mobília', '#FDCB6E', 'home', TRUE),
(NULL, 'Seguros', 'expense', 'Seguros de vida, carro e residência', '#E17055', 'shield-alt', TRUE),
(NULL, 'Impostos', 'expense', 'Impostos, taxas e contribuições', '#74B9FF', 'clipboard', TRUE);

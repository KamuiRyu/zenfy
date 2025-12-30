-- +goose Up
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'expense' CHECK (type IN ('expense', 'income', 'transfer', 'cashback', 'refund')),
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
(NULL, 'Refeições', 'expense', 'Alimentação, restaurantes, delivery e supermercados', '#FF6B6B', 'SiUtensils', TRUE),
(NULL, 'Transporte', 'expense', 'Transporte público, combustível e manutenção veicular', '#4ECDC4', 'BsCar', TRUE),
(NULL, 'Saúde', 'expense', 'Consultas médicas, medicamentos e planos de saúde', '#45B7D1', 'SiHospital', TRUE),
(NULL, 'Educação', 'expense', 'Cursos, livros e materiais educacionais', '#96CEB4', 'BsBook', TRUE),
(NULL, 'Entretenimento', 'expense', 'Cinema, shows, hobbies e atividades recreativas', '#FFEAA7', 'BsFilm', TRUE),
(NULL, 'Compras', 'expense', 'Roupas, eletrônicos e itens pessoais', '#DDA0DD', 'BsBag', TRUE),
(NULL, 'Serviços Públicos', 'expense', 'Luz, água, telefone, internet e gás', '#FF7675', 'BsLightbulb', TRUE),
(NULL, 'Netflix', 'expense', 'Assinatura do serviço de streaming Netflix', '#E50914', 'SiNetflix', TRUE),
(NULL, 'Spotify', 'expense', 'Assinatura do serviço de música Spotify', '#1DB954', 'SiSpotify', TRUE),
(NULL, 'Amazon Prime', 'expense', 'Assinatura do Amazon Prime Video', '#FF9900', 'SiAmazon', TRUE),
(NULL, 'Disney+', 'expense', 'Assinatura do Disney+', '#113CCF', 'BsTv', TRUE),
(NULL, 'HBO Max', 'expense', 'Assinatura do HBO Max', '#000000', 'SiHbo', TRUE),
(NULL, 'Apple Music', 'expense', 'Assinatura do Apple Music', '#FC3C44', 'SiApplemusic', TRUE),
(NULL, 'YouTube Premium', 'expense', 'Assinatura do YouTube Premium', '#FF0000', 'SiYoutube', TRUE),
(NULL, 'Outras Assinaturas', 'expense', 'Outras assinaturas e serviços de streaming', '#A29BFE', 'BsTv', TRUE),
(NULL, 'Renda', 'income', 'Salário, rendimentos e trabalhos freelance', '#00B894', 'BsCash', TRUE),
(NULL, 'Imprevistos', 'expense', 'Despesas não planejadas e emergências', '#636E72', 'BsExclamationTriangle', TRUE),
(NULL, 'Casa', 'expense', 'Aluguel, condomínio, reformas e mobília', '#FDCB6E', 'BsHouse', TRUE),
(NULL, 'Seguros', 'expense', 'Seguros de vida, carro e residência', '#E17055', 'BsShield', TRUE),
(NULL, 'Impostos', 'expense', 'Impostos, taxas e contribuições', '#74B9FF', 'BsClipboard', TRUE);

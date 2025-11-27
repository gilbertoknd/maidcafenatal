--Criando tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,           
    nome VARCHAR(100) NOT NULL,      
    descricao TEXT,                  
    preco DECIMAL(10, 2) NOT NULL,   
    imagem_url VARCHAR(255),         
    categoria VARCHAR(50) NOT NULL,  
    destaque BOOLEAN DEFAULT FALSE,  
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Limpa dados antigos para desenvolvimento
TRUNCATE TABLE produtos RESTART IDENTITY;

--Inserindo dados de teste
INSERT INTO produtos (nome, descricao, preco, categoria, imagem_url, destaque)
VALUES 
    ('Logo teste', 'Logo do melhor maid café do Brasil', 9.99, 'Logo', 'http://localhost:3000/images/Jua.png', TRUE); 
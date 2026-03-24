-- Création de la table accounts
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    "accountNumber" VARCHAR(20) NOT NULL UNIQUE,
    "bankCode" VARCHAR(10) NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    "accountHolder" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des données de démonstration
INSERT INTO accounts ("accountNumber", "bankCode", balance, "accountHolder") VALUES
('MG76123456789', '30001', 1500.50, 'Rasoa Ramartine'),
('MG76987654321', '30002', 2500.00, 'TENDRINJANAHARY Theodore'),
('MG76456789123', '30003', 500.75, 'RAKOTOARISOA Faneva'),
('MG76321987654', '30004', 10000.00, 'ANDRIAMANDRANTO Teophile'),
('MG76876543210', '30005', 75.20, 'SAHONDRA Lisa Parker');

-- Création d'un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_account_number_bank_code ON accounts ("accountNumber", "bankCode");

-- Message de confirmation
\echo 'Base de données initialisée avec succès!'
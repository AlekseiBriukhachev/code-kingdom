-- Create modules table
CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    module_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    xp_required INTEGER NOT NULL DEFAULT 0,
    building VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create challenges table
CREATE TABLE challenges (
    id BIGSERIAL PRIMARY KEY,
    challenge_id VARCHAR(100) UNIQUE NOT NULL,
    module_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    hint TEXT NOT NULL,
    starter TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    coin_reward INTEGER NOT NULL DEFAULT 0,
    validation_rules TEXT NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_modules_module_id ON modules(module_id);
CREATE INDEX idx_challenges_challenge_id ON challenges(challenge_id);
CREATE INDEX idx_challenges_module_id ON challenges(module_id);


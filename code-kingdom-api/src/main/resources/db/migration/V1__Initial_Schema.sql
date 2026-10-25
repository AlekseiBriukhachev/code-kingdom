-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    coins INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Create user_buildings table
CREATE TABLE user_buildings (
    user_id BIGINT NOT NULL,
    building VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_unlocked_modules table
CREATE TABLE user_unlocked_modules (
    user_id BIGINT NOT NULL,
    module_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_completed_challenges table
CREATE TABLE user_completed_challenges (
    user_id BIGINT NOT NULL,
    challenge_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_buildings_user_id ON user_buildings(user_id);
CREATE INDEX idx_user_unlocked_modules_user_id ON user_unlocked_modules(user_id);
CREATE INDEX idx_user_completed_challenges_user_id ON user_completed_challenges(user_id);
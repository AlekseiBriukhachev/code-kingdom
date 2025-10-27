import React from 'react';
import { Code } from 'lucide-react';

function Header({ username, gameState }) {
    return (
        <div className="header-container">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="header-title">
                        <Code className="header-icon" />
                        CodeKingdom
                    </h1>
                    <p className="header-subtitle">Welcome back, {username}!</p>
                </div>

                <div className="stats-container">
                    <div className="stat-card stat-purple">
                        <div className="stat-label">Level</div>
                        <div className="stat-value">{gameState.level}</div>
                    </div>
                    <div className="stat-card stat-blue">
                        <div className="stat-label">XP</div>
                        <div className="stat-value">{gameState.xp}</div>
                    </div>
                    <div className="stat-card stat-yellow">
                        <div className="stat-label">Coins</div>
                        <div className="stat-value">💰 {gameState.coins}</div>
                    </div>
                </div>
            </div>

            <div className="progress-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(gameState.xp % (gameState.level * 200)) / (gameState.level * 200) * 100}%` }}
                    />
                </div>
                <p className="progress-text">
                    {gameState.xp % (gameState.level * 200)} / {gameState.level * 200} XP to Level {gameState.level + 1}
                </p>
            </div>
        </div>
    );
}

export default Header;
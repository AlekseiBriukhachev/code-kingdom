import React from 'react';
import { Trophy, Target } from 'lucide-react';
import { buildings } from '../utils/constants';

function KingdomView({ buildings: userBuildings }) {
    return (
        <div className="kingdom-container">
            <h2 className="section-title">
                <Trophy className="section-icon" />
                Your Kingdom
            </h2>
            <div className="kingdom-grid">
                {userBuildings.length === 0 ? (
                    <div className="empty-kingdom">
                        <Target className="empty-icon" />
                        <p>Complete challenges to build your kingdom!</p>
                    </div>
                ) : (
                    userBuildings.map((building, idx) => (
                        <div key={idx} className="building-item">
                            <div className={`building-icon ${buildings[building].color}`}>
                                {buildings[building].icon}
                            </div>
                            <p className="building-name">{building}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default KingdomView;
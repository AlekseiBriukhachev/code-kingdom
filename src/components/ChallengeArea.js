import React from 'react';
import { Star, CheckCircle, Zap } from 'lucide-react';

function ChallengeArea({
    currentModule,
    currentChallenge,
    userCode,
    setUserCode,
    feedback,
    showVictory,
    loading,
    isChallengeCompleted,
    selectChallenge,
    setCurrentChallenge,
    submitCode
}) {
    if (!currentModule) {
        return (
            <div className="challenge-area-container">
                <div className="empty-state">
                    <Star className="empty-state-icon" />
                    <h3 className="empty-state-title">Select a Module</h3>
                    <p className="empty-state-text">Choose a learning module from the left to start your journey!</p>
                </div>
            </div>
        );
    }

    if (!currentChallenge) {
        return (
            <div className="challenge-area-container">
                <h2 className="challenge-area-title">{currentModule.name}</h2>
                <div className="challenge-list">
                    {currentModule.challenges.map(challenge => (
                        <button
                            key={challenge.id}
                            onClick={() => selectChallenge(challenge)}
                            className={`challenge-card ${isChallengeCompleted(challenge.id) ? 'challenge-completed' : ''
                                }`}
                        >
                            <div className="challenge-header">
                                <h3 className="challenge-title">{challenge.title}</h3>
                                {isChallengeCompleted(challenge.id) && (
                                    <CheckCircle className="check-icon" />
                                )}
                            </div>
                            <p className="challenge-description">{challenge.description}</p>
                            <div className="challenge-rewards">
                                <span className="reward-xp">+{challenge.xpReward} XP</span>
                                <span className="reward-coins">+{challenge.coinReward} Coins</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="challenge-area-container">
            <div className="challenge-detail">
                <button
                    onClick={() => setCurrentChallenge(null)}
                    className="back-button"
                >
                    ← Back to Challenges
                </button>
                <h2 className="challenge-detail-title">{currentChallenge.title}</h2>
                <p className="challenge-detail-description">{currentChallenge.description}</p>
            </div>

            <div className="hint-box">
                <p className="hint-text">💡 Hint: {currentChallenge.hint}</p>
            </div>

            <div className="code-editor-container">
                <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="code-editor"
                    placeholder="Write your Java code here..."
                    spellCheck={false}
                />
            </div>

            <div className="submit-container">
                <button
                    onClick={submitCode}
                    disabled={loading}
                    className="btn-primary btn-submit"
                >
                    <Zap className="btn-icon" />
                    {loading ? 'Submitting...' : 'Submit Code'}
                </button>
            </div>

            {feedback && (
                <div className={`feedback-box ${feedback.includes('✅') ? 'feedback-success' : 'feedback-error'}`}>
                    <p className="feedback-message">{feedback}</p>
                    {showVictory && (
                        <div className="feedback-rewards">
                            <p>+{currentChallenge.xpReward} XP earned!</p>
                            <p>+{currentChallenge.coinReward} Coins earned!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ChallengeArea;
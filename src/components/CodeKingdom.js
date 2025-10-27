import React, { useState, useEffect } from 'react';
import { Trophy, Code, Lock, CheckCircle, Star, Zap, Book, Target, LogIn } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

const CodeKingdom = () => {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [gameState, setGameState] = useState(null);
    const [modules, setModules] = useState([]);
    const [currentModule, setCurrentModule] = useState(null);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showVictory, setShowVictory] = useState(false);
    const [loading, setLoading] = useState(false);

    const buildings = {
        'Startup Garage': { icon: '🏠', color: 'bg-blue-500' },
        'Data Warehouse': { icon: '📦', color: 'bg-green-500' },
        'Parallel Factory': { icon: '⚡', color: 'bg-yellow-500' },
        'Enterprise Tower': { icon: '🌱', color: 'bg-purple-500' }
    };

    useEffect(() => {
        if (isLoggedIn) {
            loadGameState();
            loadModules();
        }
    }, [isLoggedIn]);

    const loadGameState = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/game-state/${username}`);
            const data = await response.json();
            setGameState(data);
        } catch (error) {
            console.error('Error loading game state:', error);
        }
    };

    const loadModules = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/modules`);
            const data = await response.json();
            setModules(data);
        } catch (error) {
            console.error('Error loading modules:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (username.trim()) {
            setLoading(true);
            try {
                await fetch(`${API_BASE_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username.trim() })
                });
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error creating user:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const selectModule = (moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        setCurrentModule(module);
        setCurrentChallenge(null);
        setUserCode('');
        setFeedback('');
    };

    const selectChallenge = (challenge) => {
        setCurrentChallenge(challenge);
        setUserCode(challenge.starter);
        setFeedback('');
        setShowVictory(false);
    };

    const submitCode = async () => {
        if (!currentChallenge) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    challengeId: currentChallenge.id,
                    code: userCode
                })
            });

            const result = await response.json();

            if (result.success) {
                setGameState(result.gameState);
                if (result.xpEarned > 0) {
                    setFeedback(`✅ ${result.message}`);
                    setShowVictory(true);
                } else {
                    setFeedback(`✅ ${result.message}`);
                }
            } else {
                setFeedback(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error('Error submitting code:', error);
            setFeedback('❌ Error submitting code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isModuleUnlocked = (moduleId) => {
        return gameState?.unlockedModules.includes(moduleId);
    };

    const isChallengeCompleted = (challengeId) => {
        return gameState?.completedChallenges.includes(challengeId);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 max-w-md w-full border border-purple-500/30 shadow-2xl">
                    <div className="text-center mb-8">
                        <Code className="w-20 h-20 mx-auto mb-4 text-purple-400" />
                        <h1 className="text-4xl font-bold mb-2">CodeKingdom</h1>
                        <p className="text-gray-400">Master Java. Build Your Empire.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Choose Your Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                                placeholder="Enter username..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 px-6 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Loading...'
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 inline mr-2" />
                                    Start Your Journey
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading your kingdom...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <Code className="w-10 h-10 text-purple-400" />
                            CodeKingdom
                        </h1>
                        <p className="text-gray-400 mt-1">Welcome back, {username}!</p>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-purple-800/40 px-6 py-3 rounded-lg backdrop-blur">
                            <div className="text-sm text-gray-300">Level</div>
                            <div className="text-2xl font-bold">{gameState.level}</div>
                        </div>
                        <div className="bg-blue-800/40 px-6 py-3 rounded-lg backdrop-blur">
                            <div className="text-sm text-gray-300">XP</div>
                            <div className="text-2xl font-bold">{gameState.xp}</div>
                        </div>
                        <div className="bg-yellow-800/40 px-6 py-3 rounded-lg backdrop-blur">
                            <div className="text-sm text-gray-300">Coins</div>
                            <div className="text-2xl font-bold">💰 {gameState.coins}</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden backdrop-blur">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                        style={{ width: `${(gameState.xp % (gameState.level * 200)) / (gameState.level * 200) * 100}%` }}
                    />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                    {gameState.xp % (gameState.level * 200)} / {gameState.level * 200} XP to Level {gameState.level + 1}
                </p>
            </div>

            {/* Kingdom View */}
            <div className="max-w-7xl mx-auto mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Your Kingdom
                </h2>
                <div className="grid grid-cols-4 gap-4 bg-gradient-to-br from-green-900/20 to-blue-900/20 p-6 rounded-xl backdrop-blur border border-purple-500/20">
                    {gameState.buildings.length === 0 ? (
                        <div className="col-span-4 text-center py-12 text-gray-400">
                            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Complete challenges to build your kingdom!</p>
                        </div>
                    ) : (
                        gameState.buildings.map((building, idx) => (
                            <div key={idx} className="text-center">
                                <div className={`${buildings[building].color} w-24 h-24 mx-auto rounded-lg flex items-center justify-center text-4xl shadow-lg transform hover:scale-110 transition`}>
                                    {buildings[building].icon}
                                </div>
                                <p className="mt-2 text-sm font-semibold">{building}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
                {/* Module Selection */}
                <div className="col-span-1">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Book className="w-6 h-6 text-blue-400" />
                        Learning Modules
                    </h2>
                    <div className="space-y-3">
                        {modules.map(module => {
                            const unlocked = isModuleUnlocked(module.id);
                            const completedCount = module.challenges.filter(c =>
                                isChallengeCompleted(c.id)
                            ).length;

                            return (
                                <button
                                    key={module.id}
                                    onClick={() => unlocked && selectModule(module.id)}
                                    disabled={!unlocked}
                                    className={`w-full text-left p-4 rounded-lg transition transform hover:scale-105 ${unlocked
                                        ? currentModule?.id === module.id
                                            ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                                            : 'bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur'
                                        : 'bg-gray-900/30 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{module.icon}</span>
                                        {!unlocked && <Lock className="w-5 h-5 text-gray-500" />}
                                        {unlocked && completedCount === module.challenges.length && (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        )}
                                    </div>
                                    <h3 className="font-bold">{module.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                                    {!unlocked && (
                                        <p className="text-xs text-yellow-400 mt-2">
                                            Requires {module.xpRequired} XP
                                        </p>
                                    )}
                                    {unlocked && (
                                        <p className="text-xs text-green-400 mt-2">
                                            {completedCount}/{module.challenges.length} completed
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Challenge Area */}
                <div className="col-span-2">
                    {!currentModule ? (
                        <div className="bg-gray-800/30 backdrop-blur rounded-lg p-12 text-center border border-gray-700">
                            <Star className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                            <h3 className="text-2xl font-bold mb-2">Select a Module</h3>
                            <p className="text-gray-400">Choose a learning module from the left to start your journey!</p>
                        </div>
                    ) : !currentChallenge ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{currentModule.name}</h2>
                            <div className="space-y-3">
                                {currentModule.challenges.map(challenge => (
                                    <button
                                        key={challenge.id}
                                        onClick={() => selectChallenge(challenge)}
                                        className={`w-full text-left p-4 rounded-lg transition transform hover:scale-105 ${isChallengeCompleted(challenge.id)
                                            ? 'bg-green-800/30 border border-green-500/30'
                                            : 'bg-gray-800/50 hover:bg-gray-700/50'
                                            } backdrop-blur`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold">{challenge.title}</h3>
                                            {isChallengeCompleted(challenge.id) && (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">{challenge.description}</p>
                                        <div className="flex gap-4 mt-2 text-xs">
                                            <span className="text-blue-400">+{challenge.xpReward} XP</span>
                                            <span className="text-yellow-400">+{challenge.coinReward} Coins</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-4">
                                <button
                                    onClick={() => setCurrentChallenge(null)}
                                    className="text-gray-400 hover:text-white mb-4"
                                >
                                    ← Back to Challenges
                                </button>
                                <h2 className="text-2xl font-bold">{currentChallenge.title}</h2>
                                <p className="text-gray-400 mt-1">{currentChallenge.description}</p>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 mb-4 border border-blue-500/30">
                                <p className="text-sm text-blue-300">💡 Hint: {currentChallenge.hint}</p>
                            </div>

                            <div className="mb-4">
                                <textarea
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    className="w-full h-64 bg-gray-900 text-green-400 font-mono p-4 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                                    placeholder="Write your Java code here..."
                                    spellCheck={false}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={submitCode}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 py-3 px-6 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Zap className="w-5 h-5 inline mr-2" />
                                    {loading ? 'Submitting...' : 'Submit Code'}
                                </button>
                            </div>

                            {feedback && (
                                <div className={`mt-4 p-4 rounded-lg ${feedback.includes('✅')
                                    ? 'bg-green-800/30 border border-green-500/30'
                                    : 'bg-red-800/30 border border-red-500/30'
                                    }`}>
                                    <p className="font-semibold">{feedback}</p>
                                    {showVictory && (
                                        <div className="mt-2 text-sm">
                                            <p>+{currentChallenge.xpReward} XP earned!</p>
                                            <p>+{currentChallenge.coinReward} Coins earned!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeKingdom;
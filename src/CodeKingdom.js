import React, { useState, useEffect } from 'react';
import { Trophy, Code, Lock, CheckCircle, Star, Zap, Book, Target } from 'lucide-react';

const CodeKingdom = () => {
    const [gameState, setGameState] = useState({
        xp: 0,
        level: 1,
        coins: 0,
        buildings: [],
        unlockedModules: ['basics'],
        completedChallenges: []
    });

    const [currentModule, setCurrentModule] = useState(null);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showVictory, setShowVictory] = useState(false);

    const modules = {
        basics: {
            id: 'basics',
            name: 'Java Basics',
            icon: '🏠',
            description: 'Learn variables, data types, and basic syntax',
            xpRequired: 0,
            building: 'Startup Garage',
            challenges: [
                {
                    id: 'basics-1',
                    title: 'Your First Variable',
                    description: 'Create a String variable named "companyName" with value "CodeKingdom"',
                    hint: 'Use: String variableName = "value";',
                    starter: '// Create your variable here\n',
                    solution: 'String companyName = "CodeKingdom";',
                    validation: (code) => {
                        return code.includes('String') &&
                            code.includes('companyName') &&
                            code.includes('CodeKingdom');
                    },
                    xpReward: 50,
                    coinReward: 10
                },
                {
                    id: 'basics-2',
                    title: 'Mathematical Foundation',
                    description: 'Create two int variables (a=10, b=20) and calculate their sum in a variable named "result"',
                    hint: 'Declare int variables and use the + operator',
                    starter: '// Create your variables here\n',
                    solution: 'int a = 10;\nint b = 20;\nint result = a + b;',
                    validation: (code) => {
                        return code.includes('int a') &&
                            code.includes('int b') &&
                            code.includes('result') &&
                            code.includes('+');
                    },
                    xpReward: 75,
                    coinReward: 15
                },
                {
                    id: 'basics-3',
                    title: 'Method Creation',
                    description: 'Create a method called "greet" that returns "Hello, Developer!"',
                    hint: 'Use: public String methodName() { return "value"; }',
                    starter: '// Create your method here\n',
                    solution: 'public String greet() {\n    return "Hello, Developer!";\n}',
                    validation: (code) => {
                        return code.includes('String greet') &&
                            code.includes('return') &&
                            code.includes('Hello, Developer!');
                    },
                    xpReward: 100,
                    coinReward: 25
                }
            ]
        },
        collections: {
            id: 'collections',
            name: 'Collections Framework',
            icon: '📦',
            description: 'Master Lists, Sets, Maps, and data structures',
            xpRequired: 200,
            building: 'Data Warehouse',
            challenges: [
                {
                    id: 'collections-1',
                    title: 'Building Inventory',
                    description: 'Create an ArrayList of Strings to store building names. Add "Garage" and "Warehouse"',
                    hint: 'Use: ArrayList<String> list = new ArrayList<>(); then list.add("item");',
                    starter: 'import java.util.ArrayList;\n\n// Create and populate your list\n',
                    solution: 'ArrayList<String> buildings = new ArrayList<>();\nbuildings.add("Garage");\nbuildings.add("Warehouse");',
                    validation: (code) => {
                        return code.includes('ArrayList') &&
                            code.includes('String') &&
                            code.includes('add') &&
                            code.includes('Garage') &&
                            code.includes('Warehouse');
                    },
                    xpReward: 150,
                    coinReward: 30
                },
                {
                    id: 'collections-2',
                    title: 'Resource Manager',
                    description: 'Create a HashMap to map resource names to quantities. Add "wood"->100 and "stone"->50',
                    hint: 'Use: HashMap<String, Integer> map = new HashMap<>(); then map.put(key, value);',
                    starter: 'import java.util.HashMap;\n\n// Create your resource map\n',
                    solution: 'HashMap<String, Integer> resources = new HashMap<>();\nresources.put("wood", 100);\nresources.put("stone", 50);',
                    validation: (code) => {
                        return code.includes('HashMap') &&
                            code.includes('put') &&
                            code.includes('wood') &&
                            code.includes('stone');
                    },
                    xpReward: 200,
                    coinReward: 40
                }
            ]
        },
        multithreading: {
            id: 'multithreading',
            name: 'Multithreading',
            icon: '⚡',
            description: 'Learn concurrent programming and parallel execution',
            xpRequired: 500,
            building: 'Parallel Factory',
            challenges: [
                {
                    id: 'thread-1',
                    title: 'Worker Thread',
                    description: 'Create a class that implements Runnable with a run method that prints "Worker active"',
                    hint: 'Use: class Worker implements Runnable { public void run() { ... } }',
                    starter: '// Create your Worker class\n',
                    solution: 'class Worker implements Runnable {\n    public void run() {\n        System.out.println("Worker active");\n    }\n}',
                    validation: (code) => {
                        return code.includes('implements Runnable') &&
                            code.includes('public void run') &&
                            code.includes('Worker active');
                    },
                    xpReward: 250,
                    coinReward: 50
                }
            ]
        },
        spring: {
            id: 'spring',
            name: 'Spring Framework',
            icon: '🌱',
            description: 'Build enterprise applications with Spring',
            xpRequired: 1000,
            building: 'Enterprise Tower',
            challenges: [
                {
                    id: 'spring-1',
                    title: 'Component Creation',
                    description: 'Create a class annotated with @Component named "UserService"',
                    hint: 'Use @Component annotation above your class',
                    starter: '// Create your Spring component\n',
                    solution: '@Component\npublic class UserService {\n    // service methods\n}',
                    validation: (code) => {
                        return code.includes('@Component') &&
                            code.includes('class UserService');
                    },
                    xpReward: 300,
                    coinReward: 75
                }
            ]
        }
    };

    const buildings = {
        'Startup Garage': { icon: '🏠', color: 'bg-blue-500' },
        'Data Warehouse': { icon: '📦', color: 'bg-green-500' },
        'Parallel Factory': { icon: '⚡', color: 'bg-yellow-500' },
        'Enterprise Tower': { icon: '🌱', color: 'bg-purple-500' }
    };

    useEffect(() => {
        const xpForNextLevel = gameState.level * 200;
        if (gameState.xp >= xpForNextLevel) {
            setGameState(prev => ({
                ...prev,
                level: prev.level + 1
            }));

            Object.values(modules).forEach(module => {
                if (module.xpRequired <= gameState.xp && !gameState.unlockedModules.includes(module.id)) {
                    setGameState(prev => ({
                        ...prev,
                        unlockedModules: [...prev.unlockedModules, module.id]
                    }));
                }
            });
        }
    }, [gameState.xp]);

    const selectModule = (moduleId) => {
        setCurrentModule(moduleId);
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

    const submitCode = () => {
        if (!currentChallenge) return;

        const isCorrect = currentChallenge.validation(userCode);

        if (isCorrect) {
            const alreadyCompleted = gameState.completedChallenges.includes(currentChallenge.id);

            if (!alreadyCompleted) {
                const newXp = gameState.xp + currentChallenge.xpReward;
                const newCoins = gameState.coins + currentChallenge.coinReward;
                const newBuildings = [...gameState.buildings];

                const module = modules[currentModule];
                if (!newBuildings.includes(module.building)) {
                    newBuildings.push(module.building);
                }

                setGameState(prev => ({
                    ...prev,
                    xp: newXp,
                    coins: newCoins,
                    buildings: newBuildings,
                    completedChallenges: [...prev.completedChallenges, currentChallenge.id]
                }));

                setFeedback('✅ Perfect! Challenge completed!');
                setShowVictory(true);
            } else {
                setFeedback('✅ Correct! (Already completed)');
            }
        } else {
            setFeedback('❌ Not quite right. Check the hint and try again!');
        }
    };

    const isModuleUnlocked = (moduleId) => {
        return gameState.unlockedModules.includes(moduleId);
    };

    const isChallengeCompleted = (challengeId) => {
        return gameState.completedChallenges.includes(challengeId);
    };

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
                        <p className="text-gray-400 mt-1">Master Java. Build Your Empire.</p>
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
                        {Object.values(modules).map(module => {
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
                                            ? currentModule === module.id
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
                            <h2 className="text-2xl font-bold mb-4">{modules[currentModule].name}</h2>
                            <div className="space-y-3">
                                {modules[currentModule].challenges.map(challenge => (
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
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 py-3 px-6 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg"
                                >
                                    <Zap className="w-5 h-5 inline mr-2" />
                                    Submit Code
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
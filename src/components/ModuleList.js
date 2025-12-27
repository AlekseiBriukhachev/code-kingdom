import React from 'react';
import { Book, Lock, CheckCircle } from 'lucide-react';

function ModuleList({
    modules,
    currentModule,
    gameState,
    isModuleUnlocked,
    isChallengeCompleted,
    selectModule
}) {
    return (
        <div className="module-list-container">
            <h2 className="section-title">
                <Book className="section-icon" />
                Learning Modules
            </h2>
            <div className="module-list">
                {modules.map(module => {
                    // Module is unlocked if: it's in unlockedModules OR it requires 0 XP (starter module)
                    const unlocked = isModuleUnlocked(module.id) || module.xpRequired === 0;
                    const completedCount = module.challenges.filter(c =>
                        isChallengeCompleted(c.id)
                    ).length;
                    const isActive = currentModule?.id === module.id;

                    return (
                        <button
                            key={module.id}
                            onClick={() => unlocked && selectModule(module.id)}
                            disabled={!unlocked}
                            className={`module-card ${unlocked
                                ? isActive
                                    ? 'module-active'
                                    : 'module-unlocked'
                                : 'module-locked'
                                }`}
                        >
                            {/* <div className="module-header">
                                <span className="module-icon">{module.icon}</span>
                                {!unlocked && <Lock className="lock-icon" />}
                                {unlocked && completedCount === module.challenges.length && (
                                    <CheckCircle className="check-icon" />
                                )}
                            </div> */}
                            <h3 className="module-title">{module.name}</h3>
                            <p className="module-description">{module.description}</p>
                            {!unlocked && (
                                <p className="module-requirement">
                                    Requires {module.xpRequired} XP
                                </p>
                            )}
                            {unlocked && (
                                <p className="module-progress">
                                    {completedCount}/{module.challenges.length} completed
                                </p>
                            )}
                            {isActive && unlocked && (
                                <p className="module-active-indicator">Currently Active</p>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ModuleList;
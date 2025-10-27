import '../style/App.css';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, buildings } from '../utils/constants';
import LoginScreen from './LoginScreen';
import Header from './Header';
import KingdomView from './KingdomView';
import ModuleList from './ModuleList';
import ChallengeArea from './ChallengeArea';

function App() {
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
      <LoginScreen
        username={username}
        setUsername={setUsername}
        handleLogin={handleLogin}
        loading={loading}
      />
    );
  }

  if (!gameState) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading your kingdom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header username={username} gameState={gameState} />
      <KingdomView buildings={gameState.buildings} />

      <div className="main-content">
        <ModuleList
          modules={modules}
          currentModule={currentModule}
          gameState={gameState}
          isModuleUnlocked={isModuleUnlocked}
          isChallengeCompleted={isChallengeCompleted}
          selectModule={selectModule}
        />

        <ChallengeArea
          currentModule={currentModule}
          currentChallenge={currentChallenge}
          userCode={userCode}
          setUserCode={setUserCode}
          feedback={feedback}
          showVictory={showVictory}
          loading={loading}
          isChallengeCompleted={isChallengeCompleted}
          selectChallenge={selectChallenge}
          setCurrentChallenge={setCurrentChallenge}
          submitCode={submitCode}
        />
      </div>
    </div>
  );
}

export default App;

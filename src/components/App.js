import '../style/App.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import KingdomView from './KingdomView';
import ModuleList from './ModuleList';
import ChallengeArea from './ChallengeArea';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useGameState } from '../hooks/useGameState';
import { apiService } from '../services/apiService';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import { apiServiceMock } from '../mocks/apiServiceMock';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showVictory, setShowVictory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    gameState,
    loading: gameLoading,
    updateGameState,
    loadGameState
  } = useGameState(user?.username);

  useEffect(() => {
    if (user) {
      loadModules();
    }
  }, [user]);

  useEffect(() => {
    // Auto-select Java Basics module for users
    if (modules.length > 0 && gameState && !currentModule) {
      const basicsModule = modules.find(m => m.id === 'basics');
      if (basicsModule && gameState.unlockedModules.includes('basics')) {
        setCurrentModule(basicsModule);
      }
    }
  }, [modules, gameState, currentModule]);

  const loadModules = async () => {
    try {
      // const data = await apiService.get('/modules');
      const data = await apiServiceMock.get('/modules');
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
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
    if (!currentChallenge || !user) return;

    setSubmitting(true);
    try {
      // const result = await apiService.post('/submit', {
      const result = await apiServiceMock.post('/submit', {
        username: user.username,
        challengeId: currentChallenge.id,
        code: userCode
      });

      if (result.success) {
        updateGameState(result.gameState);
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
      setFeedback('❌ Error submitting code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isModuleUnlocked = (moduleId) => {
    return gameState?.unlockedModules.includes(moduleId);
  };

  const isChallengeCompleted = (challengeId) => {
    return gameState?.completedChallenges.includes(challengeId);
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <RegisterScreen onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  if (gameLoading && !gameState) {
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
      <Header username={user.username} gameState={gameState} />
      <KingdomView buildings={gameState?.buildings || []} />

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
          loading={submitting}
          isChallengeCompleted={isChallengeCompleted}
          selectChallenge={selectChallenge}
          setCurrentChallenge={setCurrentChallenge}
          submitCode={submitCode}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

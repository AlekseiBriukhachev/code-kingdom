import { useCallback, useEffect, useState } from "react"
import { useLocalStorage } from "./useLocalStorage";
import { apiService } from "../services/apiService";
import { apiServiceMock } from "../mocks/apiServiceMock";

export const useGameState = (username) => {
    const [gameState, setGameState] = useState(null);
    const [cachedGameState, setCachedGameState] = useLocalStorage('gameState', null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load game state from server
    const loadGameState = useCallback(async () => {
        if (!username) return;

        setLoading(true);
        setError(null);

        try {
            //     // const data = await apiService.get(`/game-state/${username}`);
            const data = await apiServiceMock.get(`/game-state/${username}`);
            setGameState(data);
            setCachedGameState(data); // Save to localStorage
        } catch (err) {
            setError(err.message);
            // If server fails, try to load from cache
            if (cachedGameState) {
                setGameState(cachedGameState);
            }
        } finally {
            setLoading(false);
        }
    }, [username, cachedGameState, setCachedGameState]);

    // Auto-save game state to localStorage whenever it changes
    useEffect(() => {
        if (gameState) {
            setCachedGameState(gameState);
        }
    }, [gameState, setCachedGameState]);

    // Load on mount
    useEffect(() => {
        if (username) {
            // First, try to load from cache immediately
            if (cachedGameState && cachedGameState.username === username) {
                setGameState(cachedGameState);
            }
            // Then load fresh data from server
            loadGameState();
        }
    }, [username, cachedGameState, loadGameState]);

    const updateGameState = useCallback((updates) => {
        setGameState(prev => {
            const updated = { ...prev, ...updates };
            setCachedGameState(updated);
            return updated;
        });
    }, [setCachedGameState]);

    return {
        gameState,
        loading,
        error,
        loadGameState,
        updateGameState
    };
};
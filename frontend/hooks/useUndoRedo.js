import { useState, useCallback } from 'react';

export const useUndoRedo = (initialState, maxHistorySize = 50) => {
  const [currentState, setCurrentState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const pushState = useCallback((newState) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
    setCurrentState(newState);
  }, [currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (!canUndo) return currentState;
    
    const newIndex = currentIndex - 1;
    const previousState = history[newIndex];
    
    setCurrentIndex(newIndex);
    setCurrentState(previousState);
    
    return previousState;
  }, [canUndo, currentIndex, history, currentState]);

  const redo = useCallback(() => {
    if (!canRedo) return currentState;
    
    const newIndex = currentIndex + 1;
    const nextState = history[newIndex];
    
    setCurrentIndex(newIndex);
    setCurrentState(nextState);
    
    return nextState;
  }, [canRedo, currentIndex, history, currentState]);

  const reset = useCallback((newState = initialState) => {
    setHistory([newState]);
    setCurrentIndex(0);
    setCurrentState(newState);
  }, [initialState]);

  const clearHistory = useCallback(() => {
    setHistory([currentState]);
    setCurrentIndex(0);
  }, [currentState]);

  return {
    state: currentState,
    setState: setCurrentState,
    pushState,
    undo,
    redo,
    reset,
    clearHistory,
    canUndo,
    canRedo,
    history,
    currentIndex
  };
};

export default useUndoRedo;

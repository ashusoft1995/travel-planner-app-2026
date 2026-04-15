"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const UndoContext = createContext();

export const useUndo = () => {
  const context = useContext(UndoContext);
  if (!context) {
    throw new Error('useUndo must be used within an UndoProvider');
  }
  return context;
};

export const UndoProvider = ({ children }) => {
  const [actions, setActions] = useState([]);
  const [maxHistorySize] = useState(100);

  const addAction = useCallback((action) => {
    const newAction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...action
    };

    setActions(prev => {
      const updated = [...prev, newAction];
      // Keep only the last maxHistorySize actions
      if (updated.length > maxHistorySize) {
        return updated.slice(-maxHistorySize);
      }
      return updated;
    });
  }, [maxHistorySize]);

  const undoAction = useCallback((actionId) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        return { ...action, undone: true, undoneAt: new Date().toISOString() };
      }
      return action;
    }));
  }, []);

  const redoAction = useCallback((actionId) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        return { ...action, undone: false, undoneAt: null };
      }
      return action;
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setActions([]);
  }, []);

  const getActionsByType = useCallback((type) => {
    return actions.filter(action => action.type === type);
  }, [actions]);

  const getRecentActions = useCallback((limit = 10) => {
    return actions.slice(-limit).reverse();
  }, [actions]);

  const canUndo = useCallback((actionId) => {
    const action = actions.find(a => a.id === actionId);
    return action && !action.undone;
  }, [actions]);

  const canRedo = useCallback((actionId) => {
    const action = actions.find(a => a.id === actionId);
    return action && action.undone;
  }, [actions]);

  const value = {
    actions,
    addAction,
    undoAction,
    redoAction,
    clearHistory,
    getActionsByType,
    getRecentActions,
    canUndo,
    canRedo,
    maxHistorySize
  };

  return (
    <UndoContext.Provider value={value}>
      {children}
    </UndoContext.Provider>
  );
};

export default UndoProvider;

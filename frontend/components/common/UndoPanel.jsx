"use client";

import { useState } from 'react';
import { FiRotateCcw, FiRotateCw, FiTrash2, FiClock, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { useUndo } from '../../context/UndoContext';

const ACTION_ICONS = {
  create: <FiCheck className="h-4 w-4 text-green-500" />,
  update: <FiAlertCircle className="h-4 w-4 text-blue-500" />,
  delete: <FiX className="h-4 w-4 text-red-500" />,
  edit: <FiAlertCircle className="h-4 w-4 text-yellow-500" />
};

const ACTION_COLORS = {
  create: 'text-green-600 bg-green-50 border-green-200',
  update: 'text-blue-600 bg-blue-50 border-blue-200',
  delete: 'text-red-600 bg-red-50 border-red-200',
  edit: 'text-yellow-600 bg-yellow-50 border-yellow-200'
};

export default function UndoPanel({ 
  showHistory = true, 
  maxItems = 10, 
  compact = false,
  className = "" 
}) {
  const { 
    actions, 
    undoAction, 
    redoAction, 
    clearHistory, 
    getRecentActions,
    canUndo,
    canRedo 
  } = useUndo();

  const [expandedAction, setExpandedAction] = useState(null);
  const recentActions = getRecentActions(maxItems);

  const handleUndo = (actionId) => {
    if (canUndo(actionId)) {
      undoAction(actionId);
    }
  };

  const handleRedo = (actionId) => {
    if (canRedo(actionId)) {
      redoAction(actionId);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (compact) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <FiClock className="mr-2 h-4 w-4" />
            Recent Actions
          </h3>
          {actions.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="space-y-2">
          {recentActions.slice(0, 5).map((action) => (
            <div
              key={action.id}
              className={`flex items-center justify-between p-2 rounded border ${
                action.undone 
                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                  : ACTION_COLORS[action.type] || 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                {ACTION_ICONS[action.type]}
                <span className="text-sm font-medium truncate">
                  {action.description}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                {canUndo(action.id) && (
                  <button
                    onClick={() => handleUndo(action.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    title="Undo"
                  >
                    <FiRotateCcw className="h-3 w-3" />
                  </button>
                )}
                {canRedo(action.id) && (
                  <button
                    onClick={() => handleRedo(action.id)}
                    className="p-1 text-gray-400 hover:text-green-600 rounded"
                    title="Redo"
                  >
                    <FiRotateCw className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {recentActions.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No recent actions
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiClock className="mr-2 h-5 w-5" />
            Activity History
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {actions.length} actions
            </span>
            {actions.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiTrash2 className="mr-1 h-3 w-3" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {recentActions.map((action) => (
          <div
            key={action.id}
            className={`p-4 transition-colors ${
              action.undone ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-full ${
                  action.undone 
                    ? 'bg-gray-200' 
                    : ACTION_COLORS[action.type]?.replace('text-', 'bg-').replace('border-', 'bg-') || 'bg-gray-200'
                }`}>
                  {ACTION_ICONS[action.type]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {action.description}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTimestamp(action.timestamp)}
                    </span>
                  </div>
                  
                  {action.details && (
                    <p className="text-sm text-gray-600 mt-1">
                      {action.details}
                    </p>
                  )}
                  
                  {action.undone && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <FiRotateCcw className="mr-1 h-3 w-3" />
                      Undone {formatTimestamp(action.undoneAt)}
                    </div>
                  )}
                  
                  {action.data && expandedAction === action.id && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(action.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-3">
                {action.data && (
                  <button
                    onClick={() => setExpandedAction(
                      expandedAction === action.id ? null : action.id
                    )}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="View details"
                  >
                    <FiAlertCircle className="h-4 w-4" />
                  </button>
                )}
                
                {canUndo(action.id) && (
                  <button
                    onClick={() => handleUndo(action.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    title="Undo"
                  >
                    <FiRotateCcw className="h-4 w-4" />
                  </button>
                )}
                
                {canRedo(action.id) && (
                  <button
                    onClick={() => handleRedo(action.id)}
                    className="p-1 text-gray-400 hover:text-green-600 rounded"
                    title="Redo"
                  >
                    <FiRotateCw className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentActions.length === 0 && (
        <div className="text-center py-8">
          <FiClock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No activity yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your actions will appear here as you use the dashboard
          </p>
        </div>
      )}
    </div>
  );
}

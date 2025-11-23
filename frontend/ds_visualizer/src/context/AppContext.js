import React, { createContext, useContext, useReducer } from 'react';

// Define the initial state
const initialState = {
  code: '# Welcome to the Data Structure Visualizer!\n# Write your Python code here\n\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\n# Example: Create a simple linked list\nhead = Node(1)\nhead.next = Node(2)\nhead.next.next = Node(3)',
  language: 'python',
  executionState: 'stopped', // stopped, running, paused
  currentStep: 0,
  totalSteps: 0,
  output: 'Welcome to Data Structure Visualizer!\n\nReady to visualize your code...',
  visualizationData: null,
  isDarkMode: false,
};

// Define action types
const actionTypes = {
  UPDATE_CODE: 'UPDATE_CODE',
  UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
  SET_EXECUTION_STATE: 'SET_EXECUTION_STATE',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_TOTAL_STEPS: 'SET_TOTAL_STEPS',
  ADD_OUTPUT: 'ADD_OUTPUT',
  CLEAR_OUTPUT: 'CLEAR_OUTPUT',
  UPDATE_VISUALIZATION_DATA: 'UPDATE_VISUALIZATION_DATA',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  RESET_EXECUTION: 'RESET_EXECUTION',
};

// Define the reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_CODE:
      return {
        ...state,
        code: action.payload,
      };
    case actionTypes.UPDATE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    case actionTypes.SET_EXECUTION_STATE:
      return {
        ...state,
        executionState: action.payload,
      };
    case actionTypes.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };
    case actionTypes.SET_TOTAL_STEPS:
      return {
        ...state,
        totalSteps: action.payload,
      };
    case actionTypes.ADD_OUTPUT:
      return {
        ...state,
        output: state.output + '\n' + action.payload,
      };
    case actionTypes.CLEAR_OUTPUT:
      return {
        ...state,
        output: '',
      };
    case actionTypes.UPDATE_VISUALIZATION_DATA:
      return {
        ...state,
        visualizationData: action.payload,
      };
    case actionTypes.TOGGLE_DARK_MODE:
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case actionTypes.RESET_EXECUTION:
      return {
        ...initialState,
        language: state.language, // Preserve language selection
        code: state.code, // Preserve current code
      };
    default:
      return state;
  }
};

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const updateCode = (code) => {
    dispatch({ type: actionTypes.UPDATE_CODE, payload: code });
  };

  const updateLanguage = (language) => {
    dispatch({ type: actionTypes.UPDATE_LANGUAGE, payload: language });
  };

  const setExecutionState = (executionState) => {
    dispatch({ type: actionTypes.SET_EXECUTION_STATE, payload: executionState });
  };

  const setCurrentStep = (step) => {
    dispatch({ type: actionTypes.SET_CURRENT_STEP, payload: step });
  };

  const setTotalSteps = (totalSteps) => {
    dispatch({ type: actionTypes.SET_TOTAL_STEPS, payload: totalSteps });
  };

  const addOutput = (output) => {
    dispatch({ type: actionTypes.ADD_OUTPUT, payload: output });
  };

  const clearOutput = () => {
    dispatch({ type: actionTypes.CLEAR_OUTPUT });
  };

  const updateVisualizationData = (data) => {
    dispatch({ type: actionTypes.UPDATE_VISUALIZATION_DATA, payload: data });
  };

  const toggleDarkMode = () => {
    dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
  };

  const resetExecution = () => {
    dispatch({ type: actionTypes.RESET_EXECUTION });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        updateCode,
        updateLanguage,
        setExecutionState,
        setCurrentStep,
        setTotalSteps,
        addOutput,
        clearOutput,
        updateVisualizationData,
        toggleDarkMode,
        resetExecution,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export action types for consistency across the app
export { actionTypes };
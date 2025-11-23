import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const ControlPanel = () => {
  const {
    state,
    setExecutionState,
    setCurrentStep,
    setTotalSteps,
    addOutput,
    clearOutput,
    resetExecution,
    updateVisualizationData
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  // Function to call backend API for code execution
  const executeCode = async (endpoint, payload = {}) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: state.code,
          language: state.language,
          ...payload
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Execution error:', error);
      addOutput(`Error: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = async () => {
    setExecutionState('running');
    addOutput('Running code...');

    const result = await executeCode('execute');

    if (result) {
      if (result.error) {
        addOutput(`Execution error: ${result.error}`);
        setExecutionState('stopped');
      } else {
        addOutput(result.output || 'Code executed successfully');
        setCurrentStep(result.visualizationData?.step || 0);
        setTotalSteps(result.visualizationData?.totalSteps || 0);
        updateVisualizationData(result.visualizationData);
        setExecutionState('stopped'); // For now, stop after full execution
      }
    }
  };

  const handlePause = () => {
    setExecutionState('paused');
    addOutput('Execution paused');
  };

  const handleStep = async () => {
    setExecutionState('running');
    addOutput(`Executing step ${state.currentStep + 1}`);

    const result = await executeCode('step', { currentStep: state.currentStep });

    if (result) {
      if (result.error) {
        addOutput(`Step error: ${result.error}`);
        setExecutionState('stopped');
      } else {
        addOutput(result.output);
        setCurrentStep(result.currentStep || 0);
        setTotalSteps(result.totalSteps || 0);
        updateVisualizationData(result.visualizationData);

        // If we've reached the end of steps, stop execution
        if (result.currentStep >= result.totalSteps) {
          setExecutionState('stopped');
        } else {
          setExecutionState('paused');
        }
      }
    }
  };

  const handleReset = () => {
    resetExecution();
    addOutput('Execution reset');
  };

  const handleStop = async () => {
    // In a real implementation, this would send a stop signal to the backend
    setExecutionState('stopped');
    setCurrentStep(0);
    await executeCode('reset');
    addOutput('Execution stopped');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <h3>Controls</h3>
      </div>
      <div style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleRun}
            disabled={state.executionState === 'running' || isLoading}
            style={{
              padding: '10px',
              backgroundColor: (state.executionState === 'running' || isLoading) ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (state.executionState === 'running' || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Loading...' : (state.executionState === 'running' ? 'Running...' : 'Run ▶')}
          </button>

          <button
            onClick={handlePause}
            disabled={state.executionState !== 'running' || isLoading}
            style={{
              padding: '10px',
              backgroundColor: (state.executionState !== 'running' || isLoading) ? '#cccccc' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (state.executionState !== 'running' || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            Pause ⏸
          </button>

          <button
            onClick={handleStep}
            disabled={isLoading}
            style={{
              padding: '10px',
              backgroundColor: isLoading ? '#cccccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Step ▷
          </button>

          <button
            onClick={handleReset}
            disabled={isLoading}
            style={{
              padding: '10px',
              backgroundColor: isLoading ? '#cccccc' : '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Reset ↺
          </button>

          <button
            onClick={handleStop}
            disabled={isLoading}
            style={{
              padding: '10px',
              backgroundColor: isLoading ? '#cccccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Stop
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>Execution Status</h4>
          <p>State: {state.executionState}</p>
          <p>Step: {state.currentStep}/{state.totalSteps}</p>
        </div>

        <div>
          <h4>Output</h4>
          <div
            style={{
              backgroundColor: '#000',
              color: '#00FF00',
              padding: '10px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              height: '150px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap'
            }}
          >
            {state.output}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
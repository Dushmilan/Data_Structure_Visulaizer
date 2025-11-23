import React from 'react';
import { useAppContext } from '../context/AppContext';

const ControlPanel = () => {
  const {
    state,
    setExecutionState,
    setCurrentStep,
    setTotalSteps,
    addOutput,
    clearOutput,
    resetExecution
  } = useAppContext();

  const handleRun = () => {
    console.log('Run code');
    setExecutionState('running');
    addOutput('Running code...');
  };

  const handlePause = () => {
    console.log('Pause execution');
    setExecutionState('paused');
    addOutput('Execution paused');
  };

  const handleStep = () => {
    console.log('Step execution');
    setCurrentStep(prev => prev + 1);
    addOutput(`Executing step ${state.currentStep + 1}`);
  };

  const handleReset = () => {
    console.log('Reset execution');
    resetExecution();
    addOutput('Execution reset');
  };

  const handleStop = () => {
    console.log('Stop execution');
    setExecutionState('stopped');
    setCurrentStep(0);
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
            disabled={state.executionState === 'running'}
            style={{
              padding: '10px',
              backgroundColor: state.executionState === 'running' ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: state.executionState === 'running' ? 'not-allowed' : 'pointer'
            }}
          >
            {state.executionState === 'running' ? 'Running...' : 'Run ▶'}
          </button>

          <button
            onClick={handlePause}
            disabled={state.executionState !== 'running'}
            style={{
              padding: '10px',
              backgroundColor: state.executionState !== 'running' ? '#cccccc' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: state.executionState !== 'running' ? 'not-allowed' : 'pointer'
            }}
          >
            Pause ⏸
          </button>

          <button
            onClick={handleStep}
            style={{
              padding: '10px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Step ▷
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: '10px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset ↺
          </button>

          <button
            onClick={handleStop}
            style={{
              padding: '10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
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
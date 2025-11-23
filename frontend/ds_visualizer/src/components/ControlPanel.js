import React, { useState } from 'react';

const ControlPanel = () => {
  const [executionState, setExecutionState] = useState('stopped'); // stopped, running, paused
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const handleRun = () => {
    console.log('Run code');
    setExecutionState('running');
  };

  const handlePause = () => {
    console.log('Pause execution');
    setExecutionState('paused');
  };

  const handleStep = () => {
    console.log('Step execution');
    setCurrentStep(prev => prev + 1);
  };

  const handleReset = () => {
    console.log('Reset execution');
    setExecutionState('stopped');
    setCurrentStep(0);
  };

  const handleStop = () => {
    console.log('Stop execution');
    setExecutionState('stopped');
    setCurrentStep(0);
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
            disabled={executionState === 'running'}
            style={{
              padding: '10px',
              backgroundColor: executionState === 'running' ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: executionState === 'running' ? 'not-allowed' : 'pointer'
            }}
          >
            {executionState === 'running' ? 'Running...' : 'Run ▶'}
          </button>
          
          <button 
            onClick={handlePause}
            disabled={executionState !== 'running'}
            style={{
              padding: '10px',
              backgroundColor: executionState !== 'running' ? '#cccccc' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: executionState !== 'running' ? 'not-allowed' : 'pointer'
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
          <p>State: {executionState}</p>
          <p>Step: {currentStep}/{totalSteps}</p>
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
            {/* This would be replaced with actual output from the backend */}
            Welcome to Data Structure Visualizer!\n\nReady to visualize your code...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
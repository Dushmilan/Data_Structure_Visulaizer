import './App.css';
import CodeEditor from './components/CodeEditor';
import VisualizationPanel from './visualizer/VisualizationPanel';
import ControlPanel from './components/ControlPanel';

function App() {
  return (
    <div className="App">
      <div className="header">
        <h1>Universal Data Structures Visualizer</h1>
      </div>
      <div className="main-container">
        <div className="editor-panel">
          <CodeEditor />
        </div>
        <div className="visualization-panel">
          <VisualizationPanel />
        </div>
        <div className="control-panel">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}

export default App;

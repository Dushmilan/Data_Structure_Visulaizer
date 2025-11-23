import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import VisualizationPanel from './visualizer/VisualizationPanel';
import ControlPanel from './components/ControlPanel';
import ExamplesPage from './components/ExamplesPage';

function Header() {
  const location = useLocation();

  return (
    <div className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h1>Universal Data Structures Visualizer</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: location.pathname === '/' ? '#61dafb' : 'white',
              fontWeight: location.pathname === '/' ? 'bold' : 'normal'
            }}
          >
            Editor
          </Link>
          <Link
            to="/examples"
            style={{
              textDecoration: 'none',
              color: location.pathname === '/examples' ? '#61dafb' : 'white',
              fontWeight: location.pathname === '/examples' ? 'bold' : 'normal'
            }}
          >
            Examples
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="editor-panel">
                  <CodeEditor />
                </div>
                <div className="visualization-panel">
                  <VisualizationPanel />
                </div>
                <div className="control-panel">
                  <ControlPanel />
                </div>
              </>
            }
          />
          <Route path="/examples" element={<ExamplesPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

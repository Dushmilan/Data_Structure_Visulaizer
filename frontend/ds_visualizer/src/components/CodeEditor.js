import React, { useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useAppContext } from '../context/AppContext';

const CodeEditor = () => {
  const { state, updateCode, updateLanguage } = useAppContext();

  const languageOptions = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
  ];

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    updateLanguage(newLanguage);

    // Set example code based on language
    if (newLanguage === 'python') {
      updateCode(`# Welcome to the Data Structure Visualizer!\n# Write your Python code here\n\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\n# Example: Create a simple linked list\nhead = Node(1)\nhead.next = Node(2)\nhead.next.next = Node(3)`);
    } else if (newLanguage === 'java') {
      updateCode(`// Welcome to the Data Structure Visualizer!\n// Write your Java code here\n\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}\n\n// Example: Create a simple linked list\nListNode head = new ListNode(1);\nhead.next = new ListNode(2);\nhead.next.next = new ListNode(3);`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>
          Language:
        </label>
        <select
          id="language-select"
          value={state.language}
          onChange={handleLanguageChange}
          style={{ padding: '5px' }}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <MonacoEditor
          height="100%"
          language={state.language}
          value={state.code}
          onChange={(value) => updateCode(value || '')}
          theme="vs-light"
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
            fontSize: 14,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
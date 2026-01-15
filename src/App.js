import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import InstallPrompt from './components/InstallPrompt';

// Import your components
import Home from './pages/Home';
import AuditFront from './pages/AuditFront';
import AuditEditor from './pages/AuditEditor';
import AuditQuestionEditor from './pages/AuditQuestionEditor';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit-front" element={<AuditFront />} />
          <Route path="/audit-editor" element={<AuditEditor />} />
          <Route path="/audit-editor/:id" element={<AuditQuestionEditor />} />
          <Route path="/audit-question-editor" element={<AuditQuestionEditor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Install Prompt */}
        <InstallPrompt />
      </div>
    </Router>
  );
}

export default App;
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AuditFront from "@/pages/AuditFront";
import AuditEditor from "@/pages/AuditEditor";
import AuditQuestionEditor from "@/pages/AuditQuestionEditor";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit-front" element={<AuditFront />} />
          <Route path="/audit-editor" element={<AuditEditor />} />
          <Route path="/audit-question-editor/:id" element={<AuditQuestionEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

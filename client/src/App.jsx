import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WaitForServerModal from "./components/WaitForServerModal";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <WaitForServerModal />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

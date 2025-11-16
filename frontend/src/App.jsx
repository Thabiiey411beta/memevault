import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pool from "./pages/Pool";
import Staking from "./pages/Staking";
import Governance from "./pages/Governance";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">MemeVault</a>
          <div className="navbar-nav">
            <a className="nav-link" href="/pool">Pool</a>
            <a className="nav-link" href="/staking">Staking</a>
            <a className="nav-link" href="/governance">Governance</a>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pool" element={<Pool />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import Start from "./section/Start";
import Home from "./section/Home";
import Goal from "./section/Goal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/home" element={<Home />} />
          <Route path="/goal" element={<Goal />} />
        </Routes>
      </Router>
    </div>
  );
}

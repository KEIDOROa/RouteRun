import { useState } from "react";
import { Start } from "./section/Start";
import { Home } from "./section/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  const [location, setLocation] = useState(null);

  return (
    <div>
      <Start setLocation={setLocation} />
      {location ? <Home location={location} /> : <p>現在地を取得中...</p>}

      <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Start } from "./section/Start";
import { Home } from "./section/Home";
import { Goal } from "./section/Goal";

export default function App() {
  const [location, setLocation] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start setLocation={setLocation} />} />
        <Route path="/home" element={<Home location={location} />} />
        <Route path="/goal" element={<Goal />} />
      </Routes>
    </BrowserRouter>
  );
}

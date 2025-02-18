import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Start } from "./section/Start";
import { Home } from "./section/Home";
import { Goal } from "./section/Goal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/goal" element={<Goal />} />
      </Routes>
    </BrowserRouter>
  );
}

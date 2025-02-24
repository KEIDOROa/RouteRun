import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Start } from "./section/Start";
import { Home } from "./section/Home";
import { Goal } from "./section/Goal";
import { SignUp } from "./section/SignUp";
import { LogIn } from "./section/LogIn";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/goal" element={<Goal />} />
      </Routes>
    </BrowserRouter>
  );
}

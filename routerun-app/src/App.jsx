import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./section/Home";
import Start from "./section/Start";
import Goal from "./section/Goal";
import DevHome from "./section/DevHome";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DevHome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/goal" element={<Goal />} />
          <Route path="*" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

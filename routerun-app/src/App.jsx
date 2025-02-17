import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./section/Home";
import Start from "./section/Start";
import Goal from "./section/Goal";

function App() {
  return (
    <div>
      <h1>RouteRun</h1>
      <nav>
        <ul>
          <li>
            <a href="/">route</a>
          </li>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/start">Start</a>
          </li>
          <li>
            <a href="/goal">Goal</a>
          </li>
        </ul>
      </nav>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/goal" element={<Goal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

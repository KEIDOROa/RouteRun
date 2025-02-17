import "./Start.css";
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();
  return (
    <div className="start-container">
      <h1>RouteRun</h1>
      <div className="button" onClick={() => navigate("/home")}>
        START
      </div>
    </div>
  );
}

export default Start;

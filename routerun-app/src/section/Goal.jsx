import { useNavigate } from "react-router-dom";
import "../style/goal.css";

export const Goal = () => {
  const navigate = useNavigate();

  return (
    <div className="goal-container">
      <h1>CONGRATULATIONS!</h1>
      <div className="message">おつかれさまでした！</div>
      <div className="button" onClick={() => navigate("/")}>
        Back
      </div>
    </div>
  );
};

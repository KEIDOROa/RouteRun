import { useNavigate } from "react-router-dom";
import "./Goal.css";

const Goal = () => {
  const navigate = useNavigate();

  return (
    <div className="goal-container">
      <h1>CONGRATULATIONS!</h1>
      <div className="message">おつかれさまでした！</div>
      <div className="button" onClick={() => navigate("/home")}>
        Back
      </div>
    </div>
  );
};

export default Goal;

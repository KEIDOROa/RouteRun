import "../style/Start.css";
import { Link } from "react-router-dom";

export const Start = () => {
  return (
    <>
      <div className="start-container">
        <h1>RouteRun</h1>
        <Link to="home">
          <div className="button">
            <p className="button-text">START</p>
          </div>
        </Link>
      </div>
    </>
  );
};

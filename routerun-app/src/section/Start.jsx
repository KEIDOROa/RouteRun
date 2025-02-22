import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Start.css";

const Start = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation はこのブラウザでサポートされていません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
      },
      (error) => {
        console.error("現在地の取得に失敗:", error);
      }
    );
  }, []);

  const handleStartClick = () => {
    if (location) {
      navigate("/home", { state: location });
    } else {
      console.error("現在地の取得が完了していません。");
    }
  };
  return (
    <div className="start-container">
      <h1>RouteRun</h1>
      <div className="button" onClick={handleStartClick}>
        <div className="button-text">START</div>
      </div>
    </div>
  );
};

export default Start;

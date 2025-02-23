import { useEffect, useState } from "react";
import { RoundTripMap } from "../components/RoundTripMap";
import { MakeMap } from "../components/MakeMap.jsx";
import { DistanceInput } from "../components/DistanceInput.jsx";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [seed, setSeed] = useState(uuidv4());
  const [isNavigating, setIsNavigating] = useState(false);
  const [goal, setgoal] = useState(false);
  const navigate = useNavigate();

  const handleRegenerate = () => {
    setSeed(uuidv4());
    setRouteData(null);
  };

  const handleStartNavigation = () => {
    console.log("案内を開始");
    setIsNavigating(true);
  };

  useEffect(() => {
    if (goal) {
      navigate("/goal");
    }
  }, [goal, navigate]);

  useEffect(() => {
    const fetchLocation = () => {
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
    };

    fetchLocation();
  }, [seed]);

  return (
    <>
      {!isNavigating ? (
        <>
          <h2>距離を設定してください</h2>
          <DistanceInput setDistance={setDistance} />
        </>
      ) : (
        <></>
      )}

      {distance && (
        <>
          <RoundTripMap
            location={location}
            distance={distance}
            seed={seed}
            routeData={setRouteData}
          />
          {routeData ? (
            <>
              <MakeMap
                encodedPath={routeData.paths[0].points}
                location={location}
                setgoal={setgoal}
              />

              {!isNavigating && (
                <>
                  <button onClick={handleStartNavigation}>
                    確定（案内開始）
                  </button>
                  <hr />
                  <button onClick={handleRegenerate}>再生成</button>
                </>
              )}
            </>
          ) : (
            <p>ルートを取得中...</p>
          )}
        </>
      )}
    </>
  );
};

Home.propTypes = {
  onRouteDataReceived: PropTypes.func.isRequired,
};

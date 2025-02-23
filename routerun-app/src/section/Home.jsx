import { useEffect, useState } from "react";
import { RoundTripMap } from "../components/RoundTripMap";
import { MakeMap } from "../components/MakeMap.jsx";
import { DistanceInput } from "../components/DistanceInput.jsx";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

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
            <div className="relative">
              <MakeMap
                encodedPath={routeData.paths[0].points}
                location={location}
                setgoal={setgoal}
              />
              {!isNavigating && (
                <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    className="h-10 rounded-full bg-white px-8 text-black"
                    onClick={handleStartNavigation}
                  >
                    ✓
                  </button>
                  <button
                    className="h-10 rounded-full bg-white px-8 text-black"
                    onClick={handleRegenerate}
                  >
                    ↺
                  </button>
                </div>
              )}
            </div>
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

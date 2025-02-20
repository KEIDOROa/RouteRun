import { useState, useRef } from "react";
import { RoundTripMap } from "../components/RoundTripMap";
import { MakeMap } from "../components/MakeMap.jsx";
import { DistanceInput } from "../components/DistanceInput.jsx";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

export const Home = () => {
  const [distance, setDistance] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [seed, setSeed] = useState(uuidv4());
  const [isNavigating, setIsNavigating] = useState(false);

  const handleRegenerate = () => {
    setSeed(uuidv4());
    setRouteData(null);
  };

  const handleStartNavigation = () => {
    console.log("案内を開始");
    setIsNavigating(true);
  };

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
            distance={distance}
            seed={seed}
            routeData={setRouteData}
          />
          {routeData ? (
            <>
              <MakeMap
                encodedPath={routeData.paths[0].points}
                setIsNavigating={isNavigating}
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

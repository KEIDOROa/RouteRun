import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const RoundTripMap = ({ origin, distance }) => {
  const graphHopperKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
  const [routeData, setRouteData] = useState(null);

  const fetchRoute = async () => {
    const url = `https://graphhopper.com/api/1/route?`;

    const params = {
      profile: "foot",
      algorithm: "round_trip",
      "round_trip.distance": distance,
      "round_trip.seed": roundTripSeed,
      pass_through: true,
      "ch.disable": true,
      point: `${origin.lat},${origin.lng}`,
      key: graphHopperKey,
    };

    try {
      console.log("生成開");
      const response = await axios.get(url, {
        params,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      console.log(response);

      if (response.data.message) {
        console.error("APIエラー:", response.data.message);
        return;
      }

      if (!response.data.paths?.length) {
        console.error("ルートが取得できませんでした:", response.data);
        return;
      }

      setRouteData(response.data); // JSONデータをstateに保存
    } catch (error) {
      console.error("API通信エラー:", error);
    }
  };

  const makeroute = () => {
    if (!graphHopperKey) {
      console.warn("GraphHopper APIキーが設定されていません");
      return;
    }
    console.log(origin + distance);
    if (!origin || !distance) return;

    fetchRoute();
  };

  return (
    <div>
      <h2>ルートデータ</h2>
      <button onClick={makeroute}>再生成</button>
      <p>{routeData}</p>
    </div>
  );
};

RoundTripMap.propTypes = {
  origin: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  distance: PropTypes.number.isRequired,
  seed: PropTypes.number.isRequired,
};

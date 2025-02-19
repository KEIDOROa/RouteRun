import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import axios from "axios";
import { FetchLocation } from "./FetchLocation";

export const RoundTripMap = ({ distance, seed, routeData }) => {
  const graphHopperKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
  const [location, setlocation] = useState(null);

  const fetchRoute = async () => {
    if (!location) return;

    const url = `https://graphhopper.com/api/1/route?`;

    const params = {
      profile: "foot",
      algorithm: "round_trip",
      "round_trip.distance": distance * 1000,
      "round_trip.seed": seed,
      point: `${location.lat},${location.lng}`,
      key: graphHopperKey,
    };

    try {
      console.log(seed);
      const response = await axios.get(url, {
        params,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      if (response.data.message) {
        console.error("APIエラー:", response.data.message);
        return;
      }

      if (!response.data.paths?.length) {
        console.error("ルートが取得できませんでした:", response.data);
        return;
      }

      routeData(response.data);
    } catch (error) {
      console.error("API通信エラー:", error);
    }
  };

  useEffect(() => {
    if (distance && location) {
      makeroute();
    }
  }, [distance, location, seed]);

  const makeroute = () => {
    if (!graphHopperKey) {
      console.warn("GraphHopper APIキーが設定されていません");
      return;
    }
    if (!location || !distance) return;

    fetchRoute();
  };

  return <FetchLocation setLocation={setlocation} />;
};

RoundTripMap.propTypes = {
  distance: PropTypes.number.isRequired,
  seed: PropTypes.number.isRequired,
  routeData: PropTypes.func.isRequired,
};

import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const RoundTripMap = ({ distance, seed, routeData, location }) => {
  const graphHopperKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;

  // fetchRouteをuseCallbackでメモ化し、makerouteの中に移動
  const makeroute = useCallback(async () => {
    if (!graphHopperKey) {
      console.warn("GraphHopper APIキーが設定されていません");
      return;
    }
    if (!location || !distance) return;

    try {
      const url = `https://graphhopper.com/api/1/route?`;
      const params = {
        profile: "foot",
        algorithm: "round_trip",
        "round_trip.distance": distance * 1000,
        "round_trip.seed": seed,
        point: `${location.lat},${location.lng}`,
        key: graphHopperKey,
      };

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
  }, [graphHopperKey, location, distance, seed, routeData]);

  useEffect(() => {
    if (distance && location) {
      makeroute();
    }
  }, [distance, location, makeroute]);
};

RoundTripMap.propTypes = {
  distance: PropTypes.number.isRequired,
  seed: PropTypes.number.isRequired,
  routeData: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

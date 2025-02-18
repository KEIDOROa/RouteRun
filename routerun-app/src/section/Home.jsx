import { useEffect, useState, useRef, useCallback } from "react";
import { RoundTripMap } from "../components/RoundTripMap";
import { MakeMap } from "../components/MakeMap.jsx";
import { DistanceInput } from "../components/DistanceInput.jsx";
import PropTypes from "prop-types";

export const Home = () => {
  const [distance, setDistance] = useState(null);
  const [location, setlocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error("Google Maps API がまだロードされていません。");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 15,
      mapId: mapId,
    });

    new window.google.maps.marker.AdvancedMarkerElement({
      position: location,
      map,
    });

    // エンコードされた経路をデコードする
    const decodedPath =
      window.google.maps.geometry.encoding.decodePath(mappath);
  }, [location, mapId, setRouteData]);

  useEffect(() => {
    if (!location || !apiKey || !mapId) return;

    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=marker&loading=async`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    window.initMap = initializeMap;

    return () => {
      delete window.initMap;
    };
  }, [location, apiKey, mapId, initializeMap]);
  // <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;

  return (
    <>
      <h2>距離を設定してください</h2>
      <DistanceInput setDistance={setDistance} />

      {distance && (
        <>
          <RoundTripMap distance={distance} routeData={setRouteData} />
          {routeData ? (
            <MakeMap encodedPath={routeData.paths[0].points} />
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

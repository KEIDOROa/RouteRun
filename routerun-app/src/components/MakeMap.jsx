import { useEffect, useRef, useState } from "react";
import { FetchLocation } from "./FetchLocation";

export const MakeMap = ({ encodedPath }) => {
  const [location, setlocation] = useState(null);
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error("Google Maps API がまだロードされていません。");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 15,
    });

    // エンコードされた経路をデコードする
    const decodedPath =
      window.google.maps.geometry.encoding.decodePath(encodedPath);

    // 経路を描画
    const polyline = new window.google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    polyline.setMap(map);
  };

  useEffect(() => {
    if (!location) return;
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      window.initMap = initializeMap;
    } else {
      initializeMap(); // すでにロードされている場合はマップを初期化
    }

    return () => {
      delete window.initMap;
    };
  }, [encodedPath, location]);

  return (
    <>
      <FetchLocation setLocation={setlocation} />
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
    </>
  );
};

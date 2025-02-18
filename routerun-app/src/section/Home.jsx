import { useEffect, useRef } from "react";

export const Home = ({ location }) => {
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!location || !apiKey) return;

    // すでに Google Maps API が読み込まれているか確認
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: location,
        map,
      });
    }
  }, [location, apiKey]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

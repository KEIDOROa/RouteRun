import { useEffect, useRef } from "react";
import "./Home.css";

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

  return (
    <div className="home-container">
      <div className="nav-container">
        <div className="menu-container">
          <div className="toggle-button">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <input type="text" placeholder="input distance" />
        <div className="text-container">
          <p>km</p>
        </div>
        <div className="empty-box"></div>
        <div className="icon-container"></div>
      </div>
      <div className="map-container">
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

import { useEffect, useRef } from "react";
import "./Home.css";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location; // Start.jsx から受け取る location 情報
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!state || !apiKey) {
      console.error("位置情報が取得できませんでした。");
      navigate("/"); // 位置情報がない場合は Start 画面へ戻る
      return;
    }

    // Google Maps API の読み込み
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
        center: state,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: state,
        map,
      });
    }
  }, [state, apiKey, navigate]);

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

export default Home;

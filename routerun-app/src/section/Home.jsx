import { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

export const Home = ({ location }) => {
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
  }, [location, mapId]);

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

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

Home.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
};

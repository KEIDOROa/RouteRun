import { useEffect, useRef, useState } from "react";
import { FetchLocation } from "./FetchLocation";

export const MakeMap = ({ encodedPath }) => {
  const [location, setLocation] = useState(null);
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

    const decodedPath =
      window.google.maps.geometry.encoding.decodePath(encodedPath);

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const filteredWaypoints = decodedPath
      .filter((_, index) => index % 5 === 0)
      .slice(0, 25)
      .map((point) => ({
        location: `${point.lat()},${point.lng()}`,
        stopover: false,
      }));

    directionsService.route(
      {
        origin: location,
        destination: location,
        waypoints: filteredWaypoints,
        travelMode: "WALKING",
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          console.error("ルート取得に失敗:", status);
        }
      }
    );
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
      initializeMap();
    }

    return () => {
      delete window.initMap;
    };
  }, [encodedPath, location]);

  return (
    <>
      <FetchLocation setLocation={setLocation} />
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
    </>
  );
};

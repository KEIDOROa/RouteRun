import { useEffect, useRef, useState } from "react";
import { FetchLocation } from "./FetchLocation";

export const MakeMap = ({ encodedPath }) => {
  const currentLocationMarker = useRef(null);
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

    //道案内テキスト処理

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
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

    //現在地表示処理

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;

          if (!currentLocationMarker.current) {
            currentLocationMarker.current = new window.google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map,
              icon: {
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: "blue",
                fillOpacity: 1,
                strokeWeight: 2,
                rotation: heading || 0,
              },
            });
          } else {
            currentLocationMarker.current.setPosition({
              lat: latitude,
              lng: longitude,
            });
            currentLocationMarker.current.setIcon({
              ...currentLocationMarker.current.getIcon(),
              rotation: heading || 0,
            });
          }
        },
        (error) => console.error("現在地の取得に失敗:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
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

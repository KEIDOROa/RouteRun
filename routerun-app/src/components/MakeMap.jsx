import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export const MakeMap = ({ encodedPath, location }) => {
  const currentLocationMarker = useRef(null);
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      setIsGoogleLoaded(true);
      return;
    }

    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsGoogleLoaded(true);
      };

      script.onerror = () =>
        console.error("Google Maps APIの読み込みに失敗しました");

      document.body.appendChild(script);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error("Google Maps API がまだロードされていません");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 15,
    });

    const decodedPath =
      window.google.maps.geometry.encoding.decodePath(encodedPath);

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
    loadGoogleMapsScript();
  }, [apiKey]);

  useEffect(() => {
    if (isGoogleLoaded) {
      initializeMap();
    }
  }, [isGoogleLoaded, encodedPath, location]);

  return (
    <>
      <div ref={mapRef} style={{ width: "60%", height: "60vh" }} />
    </>
  );
};

MakeMap.propTypes = {
  encodedPath: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
};

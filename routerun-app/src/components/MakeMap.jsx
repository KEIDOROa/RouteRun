import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export const MakeMap = ({ encodedPath, location }) => {
  const currentLocationMarker = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const watcherId = useRef(null);
  const pastPath = useRef([]);
  const visitedWaypoints = useRef(new Set());
  const [midflg, setmidflg] = useState(false);
  const [midpointMarker, setMidpointMarker] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const currentPositionMarker = useRef(null);
  let pastPolyline = null;
  let waypoints = [];

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      setIsGoogleLoaded(true);
      return;
    }

    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initMap`;
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

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 15,
    });

    const decodedPath =
      window.google.maps.geometry.encoding.decodePath(encodedPath);
    const midPoint = midpoint(decodedPath);
    addMidPointMarker(mapInstance.current, midPoint);

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
    directionsRenderer.setMap(mapInstance.current);

    waypoints = decodedPath
      .filter((_, index) => index % 5 === 0)
      .slice(0, 25)
      .map((point) => ({ lat: point.lat(), lng: point.lng() }));

    directionsService.route(
      {
        origin: location,
        destination: location,
        waypoints: waypoints.map((point) => ({ location: `${point.lat},${point.lng}`, stopover: false })),
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

    if (watcherId.current) {
      navigator.geolocation.clearWatch(watcherId.current);
    }

    if (navigator.geolocation) {
      watcherId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;

          // 現在地が中間地点に近づいた場合
          const NearMidPoint =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(latitude, longitude),
              midPoint
            );

          // 30メートル以内に到達した場合、中間地点到達フラグを立てる
          if (NearMidPoint < 30 && !midflg) {
            setmidflg(true);
            alert("中間地点");
          }

          // 現在地がGOALに近づいた場合
          const NearGoalPoint =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(latitude, longitude),
              location
            );

          if (NearGoalPoint < 30 && midflg) {
            setgoal(true);
          }
          const { latitude, longitude } = position.coords;
          const currentPos = { lat: latitude, lng: longitude };

          if (!currentLocationMarker.current) {
            currentLocationMarker.current = new window.google.maps.Marker({
              position: currentPos,
              map: mapInstance.current,
              icon: {
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: "blue",
                fillOpacity: 1,
                strokeWeight: 2,
              },
            });
          } else {
            currentLocationMarker.current.setPosition(currentPos);
          }

          updatePastPath(latitude, longitude);

          if (checkProximity(currentPos, midPoint, 30) && !midflg) {
            setmidflg(true);
            alert("中間地点に到達しました！");
          }

          waypoints.forEach((waypoint, index) => {
            if (checkProximity(currentPos, waypoint, 30)) {
              visitedWaypoints.current.add(index);
            }
          });

          const goalPos = waypoints[waypoints.length - 1];
          if (checkProximity(currentPos, goalPos, 20) && midflg && visitedWaypoints.current.size >= waypoints.length - 1) {
            window.location.href = "/goal";
          }
        },
        (error) => console.error("現在地の取得に失敗:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
  };

  const updatePastPath = (lat, lng) => {
    pastPath.current.push({ lat, lng });

    if (pastPolyline) {
      pastPolyline.setMap(null);
    }

    pastPolyline = new window.google.maps.Polyline({
      path: pastPath.current,
      geodesic: true,
      strokeColor: "red",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
    pastPolyline.setMap(mapInstance.current);
  };

  const checkProximity = (currentPos, targetPos, threshold) => {
    return (
      window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(currentPos.lat, currentPos.lng),
        new window.google.maps.LatLng(targetPos.lat, targetPos.lng)
      ) < threshold
    );
  };

  const midpoint = (decodedPath) => {
    let maxDistance = 0;
    let farthestPoint = null;

    decodedPath.forEach((point) => {
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(location),
          new window.google.maps.LatLng(point)
        );
      if (distance > maxDistance) {
        maxDistance = distance;
        farthestPoint = point;
      }
    });

    return farthestPoint;
  };

  const addMidPointMarker = (map, midPoint) => {
    if (midpointMarker) {
      midpointMarker.setMap(null);
    }

    const marker = new window.google.maps.Marker({
      position: midPoint,
      map: map,
      title: "中間地点",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: "orange",
        fillOpacity: 1,
        strokeWeight: 2,
      },
    });

    setMidpointMarker(marker);
  };

  const handleGetCurrentPosition = () => {
    if (!mapInstance.current) {
      console.error("マップが初期化されていません");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };
          setCurrentPosition(pos);

          if (currentPositionMarker.current) {
            currentPositionMarker.current.setMap(null);
          }

          currentPositionMarker.current = new window.google.maps.Marker({
            position: pos,
            map: mapInstance.current,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#00FF00",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#008800"
            },
            title: "現在地"
          });

          mapInstance.current.panTo(pos);
        },
        (error) => {
          console.error("現在地の取得に失敗:", error);
          alert("現在地を取得できませんでした。");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert("お使いのブラウザは位置情報をサポートしていません。");
    }
  };

  useEffect(() => {
    if (!location) return;
    loadGoogleMapsScript();
  }, [apiKey]);

  useEffect(() => {
    if (isGoogleLoaded) {
      window.initMap = initializeMap;
      initializeMap();
    }

    return () => {
      if (watcherId.current) {
        navigator.geolocation.clearWatch(watcherId.current);
      }
    };
  }, [isGoogleLoaded, encodedPath, location]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
      <button
        onClick={handleGetCurrentPosition}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "42%",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        }}
      >
        現在地を取得
      </button>
    </div>
  );


 };

MakeMap.propTypes = {
  encodedPath: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
};

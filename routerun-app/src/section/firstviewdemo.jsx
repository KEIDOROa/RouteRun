import { useEffect, useState } from "react";
import axios from "axios";

export const FirstViewDemo = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation はこのブラウザでサポートされていません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("現在地:", { lat, lng });
      },
      (error) => {
        console.error("現在地の取得に失敗:", error);
      }
    );
  }, []);

  return <div>testmessage</div>;
};

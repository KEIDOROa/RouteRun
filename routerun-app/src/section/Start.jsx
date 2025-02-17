import { useEffect } from "react";

const Start = ({ setLocation }) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation はこのブラウザでサポートされていません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
      },
      (error) => {
        console.error("現在地の取得に失敗:", error);
      }
    );
  }, [setLocation]);

  return <div className="text-red-500">testmessage</div>;
};

export default Start;

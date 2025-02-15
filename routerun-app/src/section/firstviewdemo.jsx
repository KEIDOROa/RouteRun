import { useEffect } from "react";

export const FirstViewDemo = ({ setLocation }) => {
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
        //勝手に追加しました
        setLocation({ lat, lng }); // 取得した座標を setLocation で更新
      },
      (error) => {
        console.error("現在地の取得に失敗:", error);
      }
    );
  }, [setLocation]);

  return <div className="text-red-500">testmessage</div>;
};

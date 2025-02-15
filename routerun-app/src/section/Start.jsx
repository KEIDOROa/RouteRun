import { useEffect } from "react";
import PropTypes from 'prop-types';

export const Start = ({ setLocation }) => {
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

Start.propTypes = {
  setLocation: PropTypes.func.isRequired,
};

import { useEffect } from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";

export const Start = ({ setLocation }) => {
  //位置情報初回のみ更新
  const GetLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation はこのブラウザでサポートされていません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        console.log("lat : " + lat + "- lng : " + lng);
      },
      (error) => {
        console.error("現在地の取得に失敗:", error);
      }
    );
  };

  //位置情報常時更新用program
  useEffect(() => {
    GetLocation;
  }, [setLocation]);

  return (
    <>
      <p>testbutton</p>
      <Link to="home">
        <button
          onClick={GetLocation}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          表示
        </button>
      </Link>
    </>
  );
};

Start.propTypes = {
  setLocation: PropTypes.func.isRequired,
};

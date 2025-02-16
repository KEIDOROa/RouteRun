import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const RoundTripMap = ({ origin, distance, seed }) => {
    const graphHopperKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
    const [routeData, setRouteData] = useState(null);

    useEffect(() => {
        if (!graphHopperKey) {
            console.warn("GraphHopper APIキーが設定されていません");
            return;
        }
        if (!origin || !distance) return;

        const fetchRoute = async () => {
            const url = `https://graphhopper.com/api/1/route?` +
                `profile=car&algorithm=round_trip&` +
                `round_trip.distance=${distance}&round_trip.seed=${seed}&` +
                `pass_through=true&ch.disable=true&` +
                `point=${origin.lat},${origin.lng}&` +
                `key=${graphHopperKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.message) {
                    console.error("APIエラー:", data.message);
                    return;
                }

                if (!data.paths?.length) {
                    console.error("ルートが取得できませんでした:", data);
                    return;
                }

                setRouteData(data); // JSONデータをstateに保存
            } catch (error) {
                console.error("API通信エラー:", error);
            }
        };

        fetchRoute();
    }, [origin, distance, seed]);

    return (
        <div>
            <h2>ルートデータ</h2>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {routeData ? JSON.stringify(routeData, null, 2) : "データ取得中..."}
            </pre>
        </div>
    );
};

RoundTripMap.propTypes = {
    origin: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }).isRequired,
    distance: PropTypes.number.isRequired,
    seed: PropTypes.number.isRequired,
};

export default RoundTripMap;

import { useState, useEffect } from "react";

export const RoundTripTest = () => {
    const [routeData, setRouteData] = useState(null);
    const [error, setError] = useState(null);

    // 仮のパラメータ
    const origin = { lat: 35.681236, lng: 139.767125 }; // 東京駅
    const distance = 10000; // 10km
    const seed = 1; // 乱数シード
    const graphHopperKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;

    useEffect(() => {
        if (!graphHopperKey) {
            setError("GraphHopper APIキーが設定されていません。");
            return;
        }

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

                console.log("GraphHopper API Response:", data);

                if (!data.paths || !Array.isArray(data.paths) || data.paths.length === 0) {
                    setError("ルートが取得できませんでした。");
                    return;
                }

                setRouteData(data);
            } catch (err) {
                setError("APIリクエスト中にエラーが発生しました: " + err.message);
            }
        };

        fetchRoute();
    }, []);

    return (
        <div>
            <h2>GraphHopper API レスポンス　テスト</h2>
            {error ? <p style={{ color: "red" }}>{error}</p> : null}
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {routeData ? JSON.stringify(routeData, null, 2) : "データ取得中..."}
            </pre>
        </div>
    );
};

export default RoundTripTest;

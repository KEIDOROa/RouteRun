import { useState } from "react";
import { Start } from "./section/Start";
import { Home } from "./section/Home";

export default function App() {
  const [location, setLocation] = useState(null);

  return (
    <div>
      <h1>Google Maps 現在地表示</h1>
      <Start setLocation={setLocation} />
      {location ? <Home location={location} /> : <p>現在地を取得中...</p>}
    </div>
  );
}

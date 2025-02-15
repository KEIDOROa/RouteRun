import { useState } from 'react';
import { FirstViewDemo } from './section/firstviewdemo';
import GoogleMapComponent from './rootmake/googlemapcomponent';

export default function App() {

  //現在地の受け渡し
  const [location, setLocation] = useState(null);

  return (
    <>


      <div>
        <h1>Google Maps 現在地表示</h1>
        <FirstViewDemo setLocation={setLocation} />
        {location ? <GoogleMapComponent location={location} /> : <p>現在地を取得中...</p>}
      </div>
    </>

  )
}

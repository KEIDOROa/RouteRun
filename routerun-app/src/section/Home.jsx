import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="nav-container">
        <div className="menu-container">
          <div className="toggle-button">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <input type="text" placeholder="input distance" />
        <div className="text-container">
          <p>km</p>
        </div>
        <div className="empty-box"></div>
        <div className="icon-container"></div>
      </div>
      <div className="map-container"></div>
    </div>
  );
}

export default Home;

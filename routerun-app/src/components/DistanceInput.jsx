import { useState } from "react";
import PropTypes from "prop-types";

export const DistanceInput = ({ setDistance }) => {
  const [inputValue, setInputValue] = useState();
  const [button, setbutton] = useState(0);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0) {
      setDistance(numValue);
      setbutton(true);
    }
  };

  return (
    <>
      {!button ? (
        <form className="home-container" onSubmit={handleSubmit}>
          <div className="nav-container">
            <div className="menu-container">
              <div className="toggle-button">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <input
              type="number"
              value={inputValue}
              onChange={handleChange}
              step="0.1"
              placeholder="input distance"
            />
          </div>
        </form>
      ) : (
        <></>
      )}
    </>
  );
};

DistanceInput.propTypes = {
  setDistance: PropTypes.func.isRequired,
  className: PropTypes.func.isRequired,
};

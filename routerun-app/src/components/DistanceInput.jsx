import { useState } from "react";
import PropTypes from "prop-types";

export const DistanceInput = ({ setDistance }) => {
  const [inputValue, setInputValue] = useState(0);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0) {
      setDistance(numValue * 1000);
    }
  };

  return (
    <div>
      <h3>距離を入力 (Km)</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="距離 (Km)"
        />
        <button type="submit">距離確定ボタン</button>
      </form>
    </div>
  );
};

DistanceInput.propTypes = {
  setDistance: PropTypes.func.isRequired,
};

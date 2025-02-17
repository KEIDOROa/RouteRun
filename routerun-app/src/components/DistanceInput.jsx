import { useState } from "react";
import PropTypes from "prop-types";

const DistanceInput = ({ setDistance }) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const numValue = parseFloat(inputValue);
        if (!isNaN(numValue) && numValue > 0) {
            setDistance(numValue);
        }
    };

    return (
        <div>
            <h3>距離を入力 (m)</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="距離 (m)"
                />
                <button type="submit">設定</button>
            </form>
        </div>
    );
};

DistanceInput.propTypes = {
    setDistance: PropTypes.func.isRequired,
};

export default DistanceInput;

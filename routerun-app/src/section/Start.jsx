import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Start = () => {
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

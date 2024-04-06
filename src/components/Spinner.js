import React from "react";
import loading from "../styles/loading.gif";

const Spinner = () => {
  return (
    <div className="text-center">
      <img src={loading} alt="" width={"50px"} height={"50px"} />
    </div>
  );
};

export default Spinner;

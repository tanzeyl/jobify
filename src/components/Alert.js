import React, { useState } from "react";
import "../App.css";

function Alert(props) {
  return (
    props.alert && (
      <>
        <div className="alertContainer">
          {props.alert.type === "success" && (
            <i className="fa-solid fa-check alertIcon"></i>
          )}
          {props.alert.type === "failure" && (
            <i className="fa-solid fa-xmark alertIcon"></i>
          )}
          {props.alert.message}
        </div>
      </>
    )
  );
}

export default Alert;

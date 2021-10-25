import React from "react";
import { Image } from "react-bootstrap";
import logo from "../assets/images/radio.gif";

const Loader = () => {
  return (
    <div
      className="bg-light"
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Image
        style={{ width: "100%" }}
        src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"
        alt="loading..."
      />
    </div>
  );
};

export default Loader;

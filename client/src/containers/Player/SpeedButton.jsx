import React, { useState } from "react";
import { Button } from "react-bootstrap";

const SpeedButton = ({ audioPlayerRef }) => {
  const [speed, setSpeed] = useState(1.0);
  const setSpeedHandler = () => {
    setSpeed((prev) => {
      if (prev < 3.0) return prev + 0.5;
      if (prev === 3.0) return 0.5;
    });
  };
  return (
    <Button
      variant="light"
      onClick={() => {
        setSpeedHandler();
        audioPlayerRef.current.playbackRate = speed;
      }}
    >
      {speed.toFixed(1) + " x"}
    </Button>
  );
};

export default SpeedButton;

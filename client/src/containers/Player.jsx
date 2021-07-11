import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { AudioContext } from "../providers/AudioProvider";

const Player = () => {
  const audioPlayerRef = React.useRef();

  const [speed, setSpeed] = React.useState(1.0);

  const { audio } = useContext(AudioContext);

  React.useEffect(() => {
    audioPlayerRef?.current?.load();
    setSpeed(1.0);
  }, [audio]);

  const setSpeedHandler = () => {
    setSpeed((prev) => {
      if (prev < 3.0) {
        audioPlayerRef.current.playbackRate = prev + 0.5;
        return prev + 0.5;
      }
      if (prev === 3.0) {
        audioPlayerRef.current.playbackRate = 0.5;
        return 0.5;
      }
    });
  };

  const fastForward = () => {
    audioPlayerRef.current.currentTime += 15;
  };
  const goBackward = () => {
    audioPlayerRef.current.currentTime -= 30;
  };

  return !audio ? (
    "No audio file"
  ) : (
    <>
      <p className="font-weight-bold">{audio.metadata.title}</p>

      <audio ref={audioPlayerRef} controls style={{ width: "100%" }}>
        <source src={audio.selfLink} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <Button variant="link" onClick={goBackward}>
        <span>
          <i className="bi bi-arrow-counterclockwise"></i>
        </span>
        {" 30s"}
      </Button>
      <Button variant="link" onClick={fastForward}>
        <span>
          <i className="bi bi-arrow-clockwise"></i>
        </span>
        {" 15s"}
      </Button>
      <Button variant="link" onClick={setSpeedHandler}>
        <i className="bi bi-speedometer2"></i>
        {` ${speed.toFixed(1)} x`}
      </Button>
    </>
  );
};

export default Player;

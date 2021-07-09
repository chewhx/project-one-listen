import React from "react";
import { Form } from "react-bootstrap";

const AudioPlayer = ({ file }) => {
  const [pbSpeed, setPbSpeed] = React.useState(1.0);
  const audioPlayerRef = React.useRef();
  return !file ? null : (
    <>
      <audio
        ref={audioPlayerRef}
        // id={`audio-player-${file._id}`}
        controls
        style={{ width: "100%" }}
      >
        <source src={file.selfLink} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className=" small text-muted d-flex justify-content-between">
        {[
          "0.5x",
          "-",
          "-",
          "1.0x",
          "+",
          "+",
          "+",
          "+",
          "+",
          "+",
          "2.0x",
          "+",
          "+",
          "2.5x",
          "+",
          "+",
          "3.0x",
        ].map((each, idx) => (
          <span key={`pbSpeed-${file._id}-indicator-${idx}`} className="py-1">
            {each}
          </span>
        ))}
      </div>
      <Form.Control
        name={`pbSpeed-${file._id}`}
        value={pbSpeed}
        type="range"
        step={0.1}
        min={0.5}
        max={3}
        onChange={(e) => {
          setPbSpeed(e.target.value);
          audioPlayerRef.current.playbackRate = pbSpeed;
        }}
      />
    </>
  );
};

export default AudioPlayer;

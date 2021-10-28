import React, { useContext } from "react";
import { Row, Col } from "react-bootstrap";
import { AudioContext } from "../providers/AudioProvider";
import { timeStamping } from "../utils";
import {
  PlayFill,
  PauseFill,
  LightningFill,
  Lightning,
} from "react-bootstrap-icons";
import { decodeHtml, stripTags } from "../utils";

const Player = () => {
  const audioPlayerRef = React.useRef();

  const [speed, setSpeed] = React.useState(1.0);
  const [playing, setPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);

  const { audio } = useContext(AudioContext);

  React.useEffect(() => {
    audioPlayerRef?.current?.load();
  }, [audio]);

  // const calculateTime = (secs) => {
  //   const minutes = Math.floor(secs / 60);
  //   const seconds = Math.floor(secs % 60);
  //   const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  //   return `${minutes}:${returnedSeconds}`;
  // };

  const playButtonHandler = () => {
    if (audioPlayerRef.current.paused) {
      audioPlayerRef.current.play();
      setPlaying(true);
    } else {
      audioPlayerRef.current.pause();
      setPlaying(false);
    }
  };

  const fastForward = () => {
    audioPlayerRef.current.currentTime += 15;
  };
  const goBackward = () => {
    audioPlayerRef.current.currentTime -= 30;
  };

  return !audio || !audioPlayerRef ? (
    "No audio file"
  ) : (
    <>
      <Row className=" bg-light">
        <audio
          ref={audioPlayerRef}
          hidden
          controls
          style={{ width: "100%" }}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onSeeking={(e) => setCurrentTime(e.target.currentTime)}
        >
          <source src={audio.enclosure[0].$.url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <div id="audio-progress-seeker-wrapper">
          {/* <progress
            id="audio-progress"
            value={currentTime}
            min="0"
            max={audioPlayerRef?.current?.duration}
          ></progress> */}
          <input
            id="audio-seeker"
            name="audio-seeker"
            type="range"
            value={currentTime}
            max={String(audioPlayerRef?.current?.duration)}
            style={{ width: "100%" }}
            onChange={(e) => {
              audioPlayerRef.current.currentTime = e.target.value;
              setCurrentTime(e.target.value);
            }}
          />
        </div>

        {/* 1st Controls */}
        <Col
          sm={6}
          className="d-flex justify-content-between align-items-center p-0 px-sm-5 m-0 my-sm-3"
        >
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => goBackward()}
          >
            <Player.RewindButton height="50" />
          </span>
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => playButtonHandler()}
          >
            {playing ? <PauseFill size="50" /> : <PlayFill size="50" />}
          </span>
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => fastForward()}
          >
            <Player.FastForwardButton height="50" />
          </span>
        </Col>
        <Col md={6}>
          <h5 className="d-block d-sm-none text-center">
            -{timeStamping(+audio["itunes:duration"][0] - +currentTime)}
          </h5>
          <strong className="d-none d-sm-block">{audio.title}</strong>
          <p className="small d-none d-sm-block">
            {(!audio["itunes:summary"]
              ? null
              : audio["itunes:summary"][0].length > 100
              ? decodeHtml(stripTags(audio["itunes:summary"][0])).slice(
                  0,
                  100
                ) + "..."
              : decodeHtml(stripTags(audio["itunes:summary"][0]))) ||
              (!audio["description"]
                ? null
                : audio["description"][0].length > 100
                ? decodeHtml(stripTags(audio["description"][0])).slice(0, 100) +
                  "..."
                : decodeHtml(stripTags(audio["description"][0])))}
          </p>
        </Col>
        <Col sm={6} id="speedRangeInput">
          <div className="speedRangeLabels d-flex justify-content-between m-0 px-1">
            <Lightning />
            <LightningFill />
          </div>
          <input
            type="range"
            value={speed}
            min="0.75"
            max="3"
            step="0.25"
            // list="custom-list"
            style={{ width: "100%" }}
            onChange={(e) => {
              audioPlayerRef.current.playbackRate = e.target.value;
              setSpeed(e.target.value);
            }}
          />
        </Col>
        {/* <Col xs={1} className="d-none d-sm-block text-center">
          {calculateTime(currentTime)}
        </Col> */}

        <Col xs={6} className="d-none d-sm-block text-center">
          -{timeStamping(+audio["itunes:duration"][0] - +currentTime)}
        </Col>
        {/* <Col xs={1} className="d-none d-sm-block text-center">
          {audio["itunes:duration"][0].includes(":")
            ? audio["itunes:duration"][0]
            : timeStamping(audio["itunes:duration"][0])}
        </Col> */}
      </Row>
      {/* 2nd Controls */}
    </>
  );
};

Player.RewindButton = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="bi bi-arrow-counterclockwise"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
    />
    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
    <text style={{ fontSize: "25%" }} x="5" y="9.5">
      30
    </text>
  </svg>
);

Player.FastForwardButton = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="bi bi-arrow-clockwise"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
    />
    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
    <text style={{ fontSize: "25%" }} x="5" y="9.5">
      15
    </text>
  </svg>
);

export default Player;

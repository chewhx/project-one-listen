import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const Speech = () => {
  const [text, setText] = useState("");

  let speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US";
  speech.text = text;
  speech.rate = 1;

  return (
    <>
      <h1 style={{ fontSize: "5rem" }}>Speech</h1>
      <small>
        This features uses the Web Speech API which may not be available on some
        browsers.
      </small>
      <Form.Group>
        <Form.Control
          id="home-text-speech-input"
          name="home-text-speech-input"
          as="textarea"
          rows="10"
          size="lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter body or paragraph of text"
        />
        <Button
          size="lg"
          variant="dark"
          onClick={() => {
            speechSynthesis.paused
              ? window.speechSynthesis.resume(speech)
              : window.speechSynthesis.speak(speech);
          }}
        >
          {speechSynthesis.paused ? "Resume" : "Synthesize"}
        </Button>
        <Button
          size="lg"
          variant="dark"
          onClick={() => window.speechSynthesis.pause(speech)}
        >
          Stop
        </Button>
      </Form.Group>
    </>
  );
};

export default Speech;

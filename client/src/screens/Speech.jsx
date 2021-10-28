import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import supportedLang from "../_data/supportedLang.json";
import api from "../utils/api";
import {
  PlayCircle,
  PauseCircle,
  XCircle,
  XCircleFill,
} from "react-bootstrap-icons";

const WebSpeech = window.speechSynthesis;
const Speech = () => {
  /* ------------------------ */
  /*         HOOKS            */
  /* ------------------------ */

  const [speech, setSpeech] = useState({
    text: "",
    mainLang: "English",
    subLang: "en-US",
    voice: "Alex",
    rate: 1,
    paused: false,
    speaking: false,
    url: "",
    disabled: false,
  });

  useEffect(() => {
    WebSpeech.cancel();
  }, []);

  let utterance = new SpeechSynthesisUtterance();
  utterance.onpause = () =>
    setSpeech((prev) => ({ ...prev, paused: true, speaking: false }));
  utterance.onresume = () =>
    setSpeech((prev) => ({ ...prev, paused: false, speaking: true }));
  utterance.onstart = () =>
    setSpeech((prev) => ({
      ...prev,
      paused: false,
      speaking: true,
      disabled: true,
    }));
  utterance.onend = () =>
    setSpeech((prev) => ({
      ...prev,
      paused: false,
      speaking: false,
      disabled: false,
    }));
  utterance.lang = speech.subLang;
  utterance.text = speech.text;
  utterance.rate = speech.rate;

  console.log(WebSpeech.pending);

  const submitUrlHandler = async () => {
    const {
      data: { data },
    } = await api({
      method: "post",
      url: "/upload",
      data: { url: speech.url },
    });
    setSpeech((prev) => ({ ...prev, text: data.content, data: data }));
  };

  return (
    <>
      <h1 style={{ fontSize: "5rem" }}>Speech</h1>
      <small>
        This features uses the Web Speech API which may not be available on some
        browsers.
      </small>
      <Row className="my-4">
        <Col md={10}>
          <Form.Control
            id="article-url"
            name="article-url"
            size="lg"
            value={speech.url}
            onChange={(e) =>
              setSpeech((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="Paste web article link here"
          />
        </Col>
        <Col md={2}>
          <Button
            block
            className="my-4 my-md-0"
            size="lg"
            variant="primary"
            onClick={() => submitUrlHandler()}
          >
            Parse
          </Button>
        </Col>
      </Row>
      <p>
        {speech.data && (
          <div>
            <a href={speech.data.url}>
              <h4>{speech.data.title}</h4>
            </a>
            <strong>{speech.data.excerpt}</strong>
          </div>
        )}
      </p>

      <Row>
        <Col md={12} className="my-3">
          <Form.Control
            id="home-text-speech-input"
            name="home-text-speech-input"
            disabled={speech.disabled}
            as="textarea"
            rows="10"
            size="lg"
            value={speech.text}
            onChange={(e) =>
              setSpeech((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Enter body or paragraph of text"
          />
        </Col>

        <Col md={6} className="mb-3 d-flex justify-content-between">
          {!speech.speaking && !speech.paused ? (
            <PlayCircle
              style={{ cursor: "pointer" }}
              size="50"
              onClick={() => WebSpeech.speak(utterance)}
            />
          ) : speech.speaking && !speech.paused ? (
            <PauseCircle
              style={{ cursor: "pointer" }}
              size="50"
              onClick={() => WebSpeech.pause()}
            />
          ) : !speech.speaking && speech.paused ? (
            <PlayCircle
              style={{ cursor: "pointer" }}
              size="50"
              onClick={() => WebSpeech.resume()}
            />
          ) : null}

          {!speech.speaking && !speech.paused ? (
            <XCircle
              size="50"
              style={{ cursor: "pointer" }}
              onClick={() => {
                WebSpeech.cancel();
                setSpeech((prev) => ({
                  ...prev,
                  paused: false,
                  speaking: false,
                  disabled: false,
                }));
              }}
            />
          ) : (
            <XCircleFill
              size="50"
              style={{ cursor: "pointer" }}
              onClick={() => {
                WebSpeech.cancel();
                setSpeech((prev) => ({
                  ...prev,
                  paused: false,
                  speaking: false,
                  disabled: false,
                }));
              }}
            />
          )}
          <Button
            variant="link"
            size="lg"
            onClick={() => {
              WebSpeech.cancel();
              setSpeech((prev) => ({
                text: "",
                mainLang: "English",
                subLang: "en-US",
                voice: "Alex",
                rate: 1,
                paused: false,
                speaking: false,
                url: "",
                disabled: false,
              }));
            }}
          >
            Clear
          </Button>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Control
            id="home-text-speech-rate"
            name="home-text-speech-rate"
            disabled={speech.disabled}
            as="select"
            size="lg"
            value={speech.rate}
            onChange={(e) => {
              setSpeech((prev) => ({
                ...prev,
                rate: parseFloat(e.target.value, 10),
              }));
            }}
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4].map(
              (e, idx) => (
                <option key={`rate-key-${idx}`} value={e}>
                  {e.toFixed(2)}
                </option>
              )
            )}
          </Form.Control>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Control
            id="home-text-speech-main-lang"
            name="home-text-speech-main-lang"
            disabled={speech.disabled}
            as="select"
            size="lg"
            value={speech.mainLang}
            onChange={(e) =>
              setSpeech((prev) => ({ ...prev, mainLang: e.target.value }))
            }
          >
            {supportedLang.map(([main, ...rest], idx) => (
              <option key={`main-lang-key-${idx}`} value={main}>
                {main}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Control
            id="home-text-speech-sub-lang"
            name="home-text-speech-sub-lang"
            disabled={speech.disabled}
            as="select"
            size="lg"
            value={speech.subLang}
            onChange={(e) =>
              setSpeech((prev) => ({ ...prev, subLang: e.target.value }))
            }
          >
            {supportedLang
              .filter(([main, ...rest]) => main === speech.mainLang)
              .map(([main, ...rest]) =>
                rest.map((sub, idx) => (
                  <option key={`sub-lang-key-${idx}`} value={sub[0]}>
                    {sub[1]}
                  </option>
                ))
              )}
          </Form.Control>
        </Col>
      </Row>
    </>
  );
};

export default Speech;

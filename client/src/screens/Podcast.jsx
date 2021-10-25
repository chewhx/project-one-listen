import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import xml2js from "xml2js";
import { ListGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Image,
  Row,
  Col,
  Spinner,
  Form,
} from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { decodeHtml, stripTags } from "../utils";
import { AudioContext } from "../providers/AudioProvider";

import DyButton from "../components/buttons/DyButton";

import api from "../utils/api";
import { dtFormat } from "../utils";
import usePodcast from "../hooks/usePodcast";

const Podcast = () => {
  /* ------------------------ */
  /*         HOOKS            */
  /* ------------------------ */

  const location = useLocation();
  const { user, getAccessTokenSilently } = useAuth0();
  const url = new URLSearchParams(location.search).get("rss");
  const [input, setInput] = useState("");
  const [data, setData] = useState();
  const [max, setMax] = useState(5);
  const { setAudio } = useContext(AudioContext);

  const { subscribe } = usePodcast();

  useEffect(() => {
    const parser = new xml2js.Parser();
    // const feed = `https://api.allorigins.win/get?url=${encodeURIComponent(
    //   query.get("rss")
    // )}`;
    const feed = `/api/v2/rss`;
    axios
      .get(feed, { params: { url } })
      // .then(({ data: { contents } }) => {
      //   parser.parseString(contents, (e, res) => {
      //     const { rss } = res;
      //     setData(rss.channel[0]);
      //   });
      // })
      .then(({ data }) => {
        parser.parseString(data, (e, res) => {
          const { rss } = res;
          setData(rss.channel[0]);
        });
      })
      .catch((e) => console.log(e));
  }, [url]);
  /* -------------------------------------------------------------------------- */

  /* ------------------------ */
  /*         HANDLERS         */
  /* ------------------------ */

  const userSubscribeHandler = async () => {
    api.defaults.headers.authorization =
      "Bearer " + (await getAccessTokenSilently());
    const { status } = await api({
      method: "put",
      url: `/podcast`,
      data: {
        title: data.title[0],
        feed: url,
        image: data["itunes:image"][0].$.href,
      },
    });
    // const { status } = await api({
    //   method: "get",
    //   url: `/user/${user.sub}`,
    // });

    return { status };
  };
  console.log(user);

  return !url ? (
    <>
      <h1 style={{ fontSize: "5rem" }}>Podcast</h1>
      <Form.Group>
        <Form.Control
          id="home-rss-input"
          name="home-rss-input"
          type="text"
          size="lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a podcast rss feed..."
        />
      </Form.Group>
      <Form.Group>
        <Link to={`/podcast/rss?rss=${input}`}>
          <Button size="lg" variant="dark">
            Play podcast
          </Button>
        </Link>
      </Form.Group>
    </>
  ) : !data ? (
    <div className="text-center">
      <Spinner variant="dark" animation="border" />
      <p className="text-muted">Loading rss feed...</p>
    </div>
  ) : (
    <Container>
      <Row>
        <Col md={3}>
          <Image src={data["itunes:image"][0].$.href} alt="" fluid />
        </Col>
        <Col md={9}>
          <a href={data.link[0]}>
            <h1>{data.title[0]}</h1>
          </a>
          <p>
            {data.description[0]
              ? decodeHtml(stripTags(data.description[0]))
              : data["itunes:summary"][0]
              ? decodeHtml(stripTags(data["itunes:summary"][0]))
              : null}
          </p>
          <div>
            <small>{data.copyright}</small>
          </div>
          <div>
            {user && user.sub && (
              <DyButton
                label="Subscribe to "
                onClick={() => {
                  subscribe({
                    title: data.title[0],
                    feed: url,
                    image: data["itunes:image"][0].$.href,
                  });
                }}
              />
            )}
          </div>
        </Col>
      </Row>
      <Row className="py-5">
        <ListGroup variant="flush">
          {data.item.slice(0, max).map((item, idx) => (
            <ListGroup.Item
              key={item.guid[0]["_"]}
              // to={`/podcast/${item.guid[0]["_"]}`}
              onClick={() => setAudio(item)}
              action
              className="py-4"
            >
              <Row>
                <Col xs={2} className="d-none d-md-block">
                  <Image
                    src={data["itunes:image"][0].$.href}
                    alt=""
                    className="img-fluid"
                  />
                </Col>
                <Col>
                  <Card style={{ border: 0, backgroundColor: "transparent" }}>
                    <h4 style={{ fontWeight: "600" }}>{item.title}</h4>
                    <h6 style={{ fontWeight: "400" }}>
                      {dtFormat.format(new Date(item.pubDate[0]))}
                    </h6>
                    <p>
                      {(!item["itunes:summary"]
                        ? null
                        : item["itunes:summary"][0].length > 100
                        ? decodeHtml(
                            stripTags(item["itunes:summary"][0])
                          ).slice(0, 100) + "..."
                        : decodeHtml(stripTags(item["itunes:summary"][0]))) ||
                        (!item["description"]
                          ? null
                          : item["description"][0].length > 100
                          ? decodeHtml(stripTags(item["description"][0])).slice(
                              0,
                              100
                            ) + "..."
                          : decodeHtml(stripTags(item["description"][0])))}
                    </p>
                  </Card>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
      <Button
        block
        variant="link"
        onClick={() =>
          setMax((prev) => {
            const newMax = prev + 5;
            if (newMax <= data.item.length) {
              return newMax;
            } else {
              return prev;
            }
          })
        }
      >
        Load more...
      </Button>
    </Container>
  );
};

export default Podcast;

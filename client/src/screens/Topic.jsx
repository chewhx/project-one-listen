import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row, Card } from "react-bootstrap";
import podcastsData from "../_data/podcasts";
import { useAuth0 } from "@auth0/auth0-react";
import usePodcast from "../hooks/usePodcast";
import DyButton from "../components/buttons/DyButton";
import useUser from "../hooks/useUser";
import SubscribeButton from "../components/SubButton";

const Topic = () => {
  const { topic } = useParams();
  const { user, isAuthenticated, refetchUser } = useUser();

  // const podcasts = [
  //   {
  //     title: "Back to Work",
  //     feed: "https://feeds.5by5.tv/b2w",
  //     image: "http://icebox.5by5.tv/images/broadcasts/19/cover.jpg",
  //   },
  //   {
  //     title: "Connected",
  //     feed: "https://www.relay.fm/connected/feed",
  //     image:
  //       "http://relayfm.s3.amazonaws.com/uploads/broadcast/image/5/connected_artwork.png",
  //   },
  //   {
  //     title: "Mac Power Users",
  //     feed: "https://www.relay.fm/mpu/feed",
  //     image:
  //       "http://relayfm.s3.amazonaws.com/uploads/broadcast/image/16/mpu_artwork.png",
  //   },
  // ];
  useEffect(() => {
    if (isAuthenticated) {
      refetchUser();
    }
  }, []);

  return (
    <>
      <Row>
        {podcastsData[topic].map(({ title, image, url }, idx) => (
          <Col key={`topic-${topic}-${idx}`} md={3}>
            <Card style={{ border: "0" }}>
              <Card.Body>
                <Link to={`/podcast/rss?rss=${url}`}>
                  <Card.Img src={image} alt={title} className="mb-4" />
                  <Card.Title
                    style={{
                      height: "3rem",
                      maxHeight: "3rem",
                      overflow: "hidden",
                    }}
                  >
                    {title}
                  </Card.Title>
                </Link>
                {user && (
                  <SubscribeButton
                    block
                    title={title}
                    url={url}
                    image={image}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Topic;

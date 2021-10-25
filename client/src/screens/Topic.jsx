import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Image, Col, Row, Card } from "react-bootstrap";
import podcastsData from "../_data/podcasts";
import { useAuth0 } from "@auth0/auth0-react";
import usePodcast from "../hooks/usePodcast";
import DyButton from "../components/buttons/DyButton";
import useUser from "../hooks/useUser";

const Topic = () => {
  const { topic } = useParams();
  const { isAuthenticated } = useAuth0();
  const { subscribe, unsubscribe } = usePodcast();
  const { user, refetchUser } = useUser();

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
    refetchUser();
  }, []);
  return (
    <>
      <Row>
        {podcastsData[topic].map(({ title, image, url }) => (
          <Col sm={3}>
            <Card style={{ border: "0" }}>
              <Link to={`/podcast/rss?rss=${url}`}>
                <Card.Body>
                  <Card.Img src={image} alt={title} className="mb-4" />
                  <Card.Title>{title}</Card.Title>
                </Card.Body>
              </Link>
              {isAuthenticated && (
                <DyButton
                  doneStatus={user?.podcasts.some((e) => e.feed === url)}
                  variant="link"
                  doAction={async () => {
                    await subscribe({
                      title: title,
                      feed: url,
                      image: image,
                    });
                  }}
                  undoAction={async () => {
                    await unsubscribe({
                      feed: url,
                    });
                  }}
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Topic;

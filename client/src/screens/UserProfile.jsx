import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Card, Row, Image, Button } from "react-bootstrap";
import usePodcast from "../hooks/usePodcast";
import useUser from "../hooks/useUser";

const UserProfile = () => {
  /* ------------------------ */
  /*         HOOKS            */
  /* ------------------------ */
  const { unsubscribe } = usePodcast();
  const { user, refetchUser } = useUser();
  console.log(user);

  useEffect(() => {
    refetchUser();
  }, []);
  /* ------------------------ */
  /*         RETURN           */
  /* ------------------------ */
  return !user ? (
    "Loading..."
  ) : (
    <>
      <Row className="flex-nowrap flex-column align-items-center">
        <Image
          src={user.picture}
          alt="user-profile-logo"
          roundedCircle
          className="mb-5"
        />
        {Object.keys(user)
          .filter((e) => e !== "picture")
          .map((each, idx) => (
            <Col xs={10} sm={6} md={4} key={`${each}-${idx}`}>
              <strong>{each.toLocaleUpperCase()}</strong>
              <p>{user[each].toString()}</p>
            </Col>
          ))}
      </Row>
      <Row>
        {!user.podcasts
          ? "Loading feed..."
          : user.podcasts.map(({ title, image, feed }, idx) => (
              <Col id={`user-podcast-item-${idx}`} key={feed} sm={3}>
                <Card style={{ border: "0" }}>
                  <Link to={`/podcast/rss?rss=${feed}`}>
                    <Card.Body>
                      <Card.Img src={image} alt={title} className="mb-4" />
                      <Card.Title>{title}</Card.Title>
                    </Card.Body>
                  </Link>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={async () => {
                      await unsubscribe(feed);
                      document.querySelector(
                        `#user-podcast-item-${idx}`
                      ).style.display = "none";
                    }}
                  >
                    Unsubscribe
                  </Button>
                </Card>
              </Col>
            ))}
      </Row>
    </>
  );
};

export default UserProfile;

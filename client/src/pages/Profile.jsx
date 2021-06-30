import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";

import FileList from "../components/Profile/FileList";
import UploadGroup from "../components/Profile/UploadGroup";
import { ListGroup } from "react-bootstrap";

const Profile = () => {
  const match = useRouteMatch();

  const { data: user, status } = useQuery(
    ["user", match.params.id],
    async () => {
      const res = await fetch(`/api/v1/user/${match.params.id}`);
      return res.json();
    },
    {
      keepPreviousData: true,
      refetchInterval: 10000,
      refetchIntervalInBackground: true,
    }
  );

  return status === "Loading"
    ? "Loading"
    : status === "success" && (
        <Container className="mt-5">
          <Row>
            <Col md={3}>
              <div className="text-center mb-3">
                <Image
                  fluid
                  src={
                    user.photo ||
                    "https://ui-avatars.com/api/?name=John+Doe&size=128"
                  }
                  roundedCircle
                />
              </div>
              <h4>{user.name || "Nameless"}</h4>
              <p className="text-muted">{user.email}</p>
              {/* <LinkContainer to={`/profile/edit/${user._id}`}>
                <Button block variant="dark" className="my-4">
                  Edit profile
                </Button>
              </LinkContainer> */}
              <ListGroup variant="flush">
                <ListGroup.Item className="p-0 mb-2 border-0">
                  <span className="text-muted">Day Limit</span>
                  <br />
                  <span>
                    {`${
                      user.limits.perDayLimit - user.limits.perDayUsed
                    } uploads left`}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className="p-0 mb-2 border-0">
                  <span className="text-muted">Month Limit</span>
                  <br />
                  <span>
                    {`${
                      user.limits.perMonthLimit - user.limits.perMonthUsed
                    } uploads left.`}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className="p-0 mb-2 border-0">
                  <span className="text-muted">File Limit</span>
                  <br />
                  <span>
                    {`${user.files.owner.length} /
            ${user.files.ownerLimit}`}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={9}>
              <UploadGroup />
              <hr />
              <FileList files={user.files.owner} />
            </Col>
          </Row>
        </Container>
      );
};

export default Profile;

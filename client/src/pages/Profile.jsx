import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";

import ResourceList from "../components/_resource/ResourceList";
import UrlUpload from "../components/forms/UrlForm";

import useResource from "../hooks/useResource";
import useUser from "../hooks/useUser";
import ProfileCard from "../components/Profile/ProfileCard";

const Profile = () => {
  // Hooks
  const match = useRouteMatch();
  const { GetAllResources } = useResource();
  const { GetUser } = useUser();

  // Functions
  const { data: user, status: userStatus } = GetUser(match.params.id);
  const { data: files, status: fileStatus } = GetAllResources();

  // Presentation
  const pageStatus = userStatus || fileStatus;
  return pageStatus === "loading"
    ? "Loading"
    : pageStatus === "success" && (
        <Container className="mt-5">
          <Row>
            <Col md={3}>
              <ProfileCard user={user} />
            </Col>
            <Col md={9}>
              <UrlUpload />
              <ResourceList files={files} />
            </Col>
          </Row>
        </Container>
      );
};

export default Profile;

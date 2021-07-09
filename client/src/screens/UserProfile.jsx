import React from "react";
import { Container } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";

import useUser from "../hooks/useUser";

import ProfileCard from "../components/_profile/ProfileCard";

const Profile = () => {
  // Hooks
  const match = useRouteMatch();
  const { GetUser } = useUser();

  // Functions
  const { data: user, status } = GetUser(match.params.id);

  // Presentation
  return status === "loading"
    ? "Loading"
    : status === "success" && (
        <Container className="mt-5">
          <ProfileCard user={user} />
        </Container>
      );
};

export default Profile;

import React from "react";
import { Container } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";

import FileList from "../components/Profile/FileList";
import ProfileCard from "../components/Profile/ProfileCard";
import UploadGroup from "../components/Profile/UploadGroup";

const Profile = () => {
  const match = useRouteMatch();

  const { data: user, status } = useQuery(
    ["user", match.params.id],
    async () => {
      const res = await fetch(`/user/${match.params.id}`);
      return res.json();
    },
    {
      keepPreviousData: true,
    }
  );

  return status === "Loading"
    ? "Loading"
    : status === "success" && (
        <Container>
          <ProfileCard user={user} />
          <UploadGroup />
          <FileList files={user.files.owner} />
        </Container>
      );
};

export default Profile;

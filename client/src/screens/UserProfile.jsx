import React from "react";
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
        <div className="mt-5">
          <ProfileCard user={user} />
        </div>
      );
};

export default Profile;

import React from "react";

import useResource from "../hooks/useResource";

import ResourceList from "../components/_resource/ResourceList";

const UserUploads = () => {
  // Hooks
  const { GetAllResources } = useResource();
  const { data: files, status } = GetAllResources();

  // Presentation
  return status === "loading"
    ? "Loading..."
    : status === "error"
    ? "Error"
    : status === "success" && <ResourceList files={files} />;
};

export default UserUploads;

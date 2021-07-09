import React from "react";
import { Container } from "react-bootstrap";

import useResource from "../hooks/useResource";

import ResourceList from "../components/_resource/ResourceList";

import { ToastContext } from "../providers/ToastProvider";

const UserUploads = () => {
  // Hooks
  const { GetAllResources } = useResource();
  const { data: files, status } = GetAllResources();
  const { addToast, removeToast, toastContent } =
    React.useContext(ToastContext);

  // Presentation
  return status === "loading"
    ? "Loading..."
    : status === "error"
    ? "Error"
    : status === "success" && (
        <Container>
          <button onClick={() => addToast("Link Posted ✅   ")}>Alert</button>
          <button onClick={() => removeToast(toastContent[0].id)}>
            Remove 1
          </button>
          <ResourceList files={files} />
        </Container>
      );
};

export default UserUploads;

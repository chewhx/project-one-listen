import React from "react";
import { Row, Dropdown, Alert } from "react-bootstrap";
import useResource from "../../../hooks/useResource";

const FileListItemActions = ({ fileId, hidden, ...rest }) => {
  const { DeleteResource } = useResource();
  const { mutate } = DeleteResource();
  const [showDeleteModal, setShowDeleteModal] = React.useState("none");
  return (
    <>
      <Dropdown {...rest}>
        <Dropdown.Toggle
          hidden={hidden}
          variant="light"
          id={`dropdown-actions-${fileId}`}
        ></Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>Email</Dropdown.Item>
          <Dropdown.Item>Save to GDrive</Dropdown.Item>
          <Dropdown.Item>Download</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowDeleteModal("flex")}>
            Delete
          </Dropdown.Item>
          <Dropdown.Item></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Row>
        <Alert
          variant="secondary"
          style={{ display: showDeleteModal }}
          className="w-100 justify-content-around"
        >
          Are you sure you want to delete? This cannot be undone.
          <Alert.Link onClick={() => mutate({ resourceId: fileId })}>
            Delete
          </Alert.Link>
          <Alert.Link
            className="text-primary"
            onClick={() => setShowDeleteModal("none")}
          >
            Cancel
          </Alert.Link>
        </Alert>
      </Row>
    </>
  );
};

export default FileListItemActions;

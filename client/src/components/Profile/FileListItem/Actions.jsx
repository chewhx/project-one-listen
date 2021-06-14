import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import axios from "axios";

const FileListItemActions = ({ fileId }) => {
  const deleteFile = async (fileId) => {
    const res = await axios.delete(`/file/${fileId}`);
    console.log(res);
  };
  const [showDeleteModal, setShowDeleteModal] = React.useState("hidden");
  return (
    <>
      <Row>
        <Col xs={12}>
          <ul className="list-inline my-2 float-right">
            <li className="list-inline-item">
              <Button variant="link">Email</Button>
            </li>
            <li className="list-inline-item">
              <Button variant="link">Save to GDrive</Button>
            </li>
            <li className="list-inline-item">
              <Button variant="link">Download</Button>
            </li>
            <li className="list-inline-item">
              <Button
                variant="link"
                onClick={() => setShowDeleteModal("visible")}
              >
                Delete
              </Button>
            </li>
          </ul>
        </Col>
        <Col
          xs={12}
          style={{ visibility: showDeleteModal }}
          className="d-flex justify-content-around"
        >
          <small>
            <strong>
              Are you sure you want to delete? This cannot be undone.
            </strong>
          </small>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => deleteFile(fileId)}
          >
            Delete
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={() => setShowDeleteModal("hidden")}
          >
            <strong>Cancel</strong>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default FileListItemActions;

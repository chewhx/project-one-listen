import React from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import ResourceItem from "./ResourceItem";

const ResourceList = ({ files }) => {
  return !files ? (
    "Loading"
  ) : (
    <Row>
      <Col>
        <ListGroup variant="flush">
          {files.map((file, idx) => (
            <ResourceItem key={`${file.owner}-file-${idx}`} file={file} />
          ))}
        </ListGroup>
      </Col>
    </Row>
  );
};

export default ResourceList;

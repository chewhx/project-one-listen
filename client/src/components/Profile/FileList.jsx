import React from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import FileListItem from "./FileListItem";

const FileList = ({ files }) => {
  return (
    <Row>
      <Col>
        <ListGroup variant="flush">
          {files.map((file, idx) => (
            <FileListItem key={`${file.owner}-file-${idx}`} file={file} />
          ))}
        </ListGroup>
      </Col>
    </Row>
  );
};

export default FileList;

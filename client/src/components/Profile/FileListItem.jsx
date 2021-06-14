import React from "react";
import { ListGroup, Row, Col, Badge } from "react-bootstrap";
import Actions from "./FileListItem/Actions";
import AudioPlayer from "./FileListItem/AudioPlayer";

const FileListItem = ({ file }) => {
  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col lg={6}>
            <h4>{file.metadata.title}</h4>
            <p className="small text-truncate">
              <a href={file.sourceUrl} alt={file.metadata.title}>
                {file.sourceUrl}
              </a>
            </p>
            <p>
              <Badge pill variant="primary">
                {file.job.status}
              </Badge>
              <small className="text-muted ml-2">{file.metadata.excerpt}</small>
            </p>
          </Col>
          <Col lg={6}>
            <AudioPlayer file={file} />
            <Actions fileId={file._id} />
          </Col>
        </Row>
      </ListGroup.Item>
    </>
  );
};

export default FileListItem;

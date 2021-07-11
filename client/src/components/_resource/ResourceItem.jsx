import React from "react";
import PropTypes from "prop-types";

import {
  ListGroup,
  Badge,
  Button,
  Row,
  Col,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

import { AudioContext } from "../../providers/AudioProvider";
import useResource from "../../hooks/useResource";

const ResourceItem = ({ file }) => {
  // Hooks
  const { setAudio } = React.useContext(AudioContext);
  const { DeleteResource } = useResource();
  const { mutate } = DeleteResource();

  // Presentation
  return (
    <>
      <ListGroup.Item className="py-3">
        <Row>
          <Col md={10}>
            <h5>{file.metadata.title}</h5>
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
          <Col md={2}>
            <div className="d-flex justify-content-start">
              <Button
                variant="link"
                onClick={() => setAudio(file)}
              >
                <i className="bi bi-earbuds"></i>
              </Button>
              <DropdownButton
                variant="link"
                title={<i className="bi bi-trash-fill"></i>}
              >
                <Dropdown.Header>Are you sure?</Dropdown.Header>
                <Dropdown.Item onClick={() => mutate({ resourceId: file._id })}>
                  Yes, delete.
                </Dropdown.Item>
                <Dropdown.Item>
                  <strong>Go back.</strong>
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </Col>
        </Row>
      </ListGroup.Item>
    </>
  );
};

ResourceItem.propTypes = {
  file: PropTypes.shape({
    metadata: PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      excerpt: PropTypes.string,
      wordCount: PropTypes.number,
      charCount: PropTypes.number,
    }),
    paths: PropTypes.shape({
      parser: PropTypes.string,
      audio: PropTypes.string,
    }),
    job: PropTypes.shape({
      status: PropTypes.string,
      queue: PropTypes.string,
    }),
    sourceUrl: PropTypes.string,
    selfLink: PropTypes.string,
    viewers: PropTypes.array,
    type: PropTypes.string,
    owner: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    _v: PropTypes.string,
  }).isRequired,
};

export default ResourceItem;

import React from "react";
import PropTypes from "prop-types";

import { ListGroup, Badge } from "react-bootstrap";
import Actions from "./ResourceItem/Actions";
import AudioPlayer from "./ResourceItem/AudioPlayer";

const ResourceItem = ({ file }) => {
  return (
    <>
      <ListGroup.Item className="py-3">
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
        <AudioPlayer file={file} />
        <Actions
          className="d-flex justify-content-end mt-2"
          fileId={file._id}
        />
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

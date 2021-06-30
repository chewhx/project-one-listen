import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import Actions from "./FileListItem/Actions";
import AudioPlayer from "./FileListItem/AudioPlayer";

const FileListItem = ({ file, disableActions }) => {
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
          hidden={disableActions}
          className="d-flex justify-content-end mt-2"
          fileId={file._id}
        />
      </ListGroup.Item>
    </>
  );
};

export default FileListItem;

import React from "react";
import { Image, ListGroup } from "react-bootstrap";

const ProfileCard = ({ user }) => {
  return (
    <>
      <div className="text-center mb-3">
        <Image
          fluid
          src={
            user.photo || "https://ui-avatars.com/api/?name=John+Doe&size=128"
          }
          roundedCircle
        />
      </div>
      <h4>{user.name || "Nameless"}</h4>
      <p className="text-muted">{user.email}</p>

      <ListGroup variant="flush">
        <ListGroup.Item className="p-0 mb-2 border-0">
          <span className="text-muted">Day Limit</span>
          <br />
          <span>
            {`${user.limits.perDayLimit - user.limits.perDayUsed} uploads left`}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="p-0 mb-2 border-0">
          <span className="text-muted">Month Limit</span>
          <br />
          <span>
            {`${
              user.limits.perMonthLimit - user.limits.perMonthUsed
            } uploads left.`}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="p-0 mb-2 border-0">
          <span className="text-muted">File Limit</span>
          <br />
          <span>
            {`${user.files.owner.length} /
${user.files.ownerLimit}`}
          </span>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default ProfileCard;

import React from "react";
import { Row, Col, Image, ListGroup } from "react-bootstrap";

const ProfileCard = ({ user }) => {
  return (
    <>
      <Row>
        <Col md={4} className="d-flex justify-content-center">
          <Image
            className="align-self-center"
            fluid
            src={user.photo}
            roundedCircle
          />
        </Col>
        <Col md={8}>
          <ListGroup variant="flush">
            {[
              ["Name", "name"],
              ["Email", "email"],
            ].map(([label, key], idx) => (
              <ListGroup.Item key={`profile-item-${idx}`}>
                <Row>
                  <Col md={3}>
                    <strong>{label}</strong>
                  </Col>
                  <Col md={9}>{user[key]}</Col>
                </Row>
              </ListGroup.Item>
            ))}

            <ListGroup.Item>
              <Row>
                <Col md={3}>
                  <strong>Day Limits</strong>
                </Col>
                <Col md={9}>{`${user.limits.perDayUsed} files
            uploaded. You have ${
              user.limits.perDayLimit - user.limits.perDayUsed
            } uploads left for the day.`}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col md={3}>
                  <strong>Month Limits</strong>
                </Col>
                <Col md={9}>{`${
                  user.limits.perMonthUsed
                } files uploaded. You have
            ${user.limits.perMonthLimit - user.limits.perMonthUsed} uploads left
            for the month.`}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col md={3}>
                  <strong>File Limits</strong>
                </Col>
                <Col
                  md={9}
                >{`You have ${user.files.owner.length} file(s). You can keep up to
            ${user.files.ownerLimit} files at any time.`}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProfileCard;

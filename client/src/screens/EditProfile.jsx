import React from "react";
import { Formik } from "formik";
import { Container, Form, ListGroup, Row } from "react-bootstrap";
import { useQuery } from "react-query";

import { useRouteMatch } from "react-router-dom";

const EditProfile = () => {
  const match = useRouteMatch();

  const { data: user, status } = useQuery(
    ["user", match.params.id],
    async () => {
      const res = await fetch(`/api/v1/user/${match.params.id}`);
      return res.json();
    },
    {
      keepPreviousData: true,
    }
  );

  return status === "loading"
    ? "Loading"
    : status === "success" && (
        <Container className="pt-5">
          <h1> Edit Profile</h1>
          <Row>
            <Formik
              initialValues={{
                email: user.email,
                password: "",
                passwordConfirm: "",
                isAdmin: user.isAdmin,
                files: [],
              }}
              onSubmit={(values) => console.log(values)}
            >
              {({ values, handleChange, handleSubmit }) => {
                console.log(values);
                return (
                  <>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control
                          as="input"
                          type="email"
                          id="email"
                          name="email"
                          onChange={handleChange}
                          value={values.email}
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control
                          as="input"
                          type="password"
                          id="password"
                          name="password"
                          onChange={handleChange}
                          value={values.password}
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Label htmlFor="passwordConfirm">
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          as="input"
                          type="password"
                          id="passpasswordConfirmword"
                          name="passwordConfirm"
                          onChange={handleChange}
                          value={values.password}
                        />
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Form.Label>Files</Form.Label>
                        {user.files.owner.map((each, idx) => (
                          <Form.Check
                            type="checkbox"
                            key={`file-item-${each._id}`}
                            name="files"
                            value={each._id}
                            onChange={handleChange}
                            onClick={handleChange}
                            label={each.metadata.title}
                          />
                        ))}
                      </ListGroup.Item>
                    </ListGroup>
                  </>
                );
              }}
            </Formik>
          </Row>
        </Container>
      );
};

export default EditProfile;

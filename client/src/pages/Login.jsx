import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Formik } from "formik";



const Login = ({loginHandler}) => {
  const form = React.createRef();


  return (
    <main className="bg-dark" style={{ minHeight: "100vh" }}>
      <Container fluid="md">
        <Row className="justify-content-center pt-5">
          <Col md={5} xs={12}>
            <Card>
              <Card.Header className="py-4">
                <div className="text-center">
                  <Image
                    style={{ width: "125px" }}
                    className="my-4"
                    roundedCircle
                    src={process.env.PUBLIC_URL + "/image/icons/brand.png"}
                    alt="brand-logo"
                  />
                  <h4>Sign into One Listen</h4>
                </div>
                <Button
                  block
                  variant="danger"
                  className="my-4"
                  href="/auth/google"
                >
                  <i className="bi bi-google mr-3"></i>Sign in with Google
                </Button>
              </Card.Header>
              <Card.Body>
                <h3 className="my-4">
                  Sign in
                  <span className="text-muted small">
                    {" "}
                    or create an account
                  </span>
                </h3>
                <Formik
                  initialValues={{}}
                  enableReinitialize={true}
                  onSubmit={loginHandler}
                >
                  {({ values, handleChange, handleSubmit }) => {
                    return (
                      <Form>
                        <Form.Group>
                          <Form.Label htmlFor="email">Email</Form.Label>
                          <Form.Control
                            as="input"
                            ref={form}
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label htmlFor="password">Password</Form.Label>
                          <Form.Control
                            as="input"
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="off"
                            onChange={handleChange}
                          />
                        </Form.Group>

                        <div className="my-3">
                          <Button block onClick={handleSubmit}>
                            Sign in
                          </Button>
                          <Button
                            block
                            onClick={handleSubmit}
                            variant="outline-secondary"
                          >
                            Create an account
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Login;

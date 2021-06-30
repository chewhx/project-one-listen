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
import axios from "axios";

const Login = () => {
  const form = React.createRef();
  const [remember, setRemember] = React.useState(false);
  React.useEffect(() => {
    const hasRemember = localStorage.getItem("one-listen-remember-email");

    if (hasRemember) {
      form.current.value = hasRemember;
      setRemember(true);
      return;
    }
    if (remember && form?.current?.value) {
      localStorage.setItem("one-listen-remember-email", form.current.value);
      return;
    }
  }, [remember, form]);

  const onSubmitHandler = async (values) => {
    if (remember) {
      localStorage.setItem("one-listen-remember-email", values.email);
    }
    await axios.post(`/auth/local`, {
      email: values.email,
      password: values.password,
    });
  };

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
                    src={process.env.PUBLIC_URL + "/images/icons/brand.png"}
                    alt="brand-logo"
                  />
                  <h4>Sign into One Listen</h4>
                </div>
                <Button
                  block
                  variant="danger"
                  className="my-4"
                  href="http://localhost:5000/auth/google"
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
                  onSubmit={onSubmitHandler}
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
                        <Form.Check
                          type="checkbox"
                          label="Remember Me"
                          checked={remember}
                          onChange={() => {
                            setRemember((prev) => {
                              if (prev) {
                                localStorage.removeItem(
                                  "one-listen-remember-email"
                                );
                              }
                              return !prev;
                            });
                          }}
                        />
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

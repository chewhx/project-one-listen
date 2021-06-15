import React from "react";
import { Card, Container, Image, Row, Col } from "react-bootstrap";

const Home = () => {
  return (
    <div>
      <div className="jumbotron">
        <div className="container text-center">
          <Image
            fluid
            roundedCircle
            className="w-25"
            src={process.env.PUBLIC_URL + "/images/icons/brand.png"}
            alt="brand-logo"
          />

          <h1 className="display-3">One Listen</h1>
          <h3>Convert web articles to mp3.</h3>
          <p>
            A web application which converts your web articles into audio files.
            Ideal for readers who want to consume content on-the-go.
          </p>
          <a className="btn btn-primary" href="/#readme">
            Get started
          </a>
          <a className="btn btn-outline-secondary" href="/#features">
            Learn more
          </a>
        </div>
      </div>

      <section id="features" className="py-5">
        <Container>
          <Row>
            <Col md={4}>
              <h2>Bring your own content</h2>
              <p>
                There are no pre-selected or curated content. You can save any
                web news articles you want to read. Just as long as their body
                text can be parsed by the web server.
              </p>
            </Col>
            <Col md={4}>
              <h2>Listen on speed mode</h2>
              <p>
                <a href="https://www.theatlantic.com/technology/archive/2015/06/the-rise-of-speed-listening/396740/">
                  Speed listening is the new speed reading.
                </a>
                It helps us learn more things, quicker. We can always go back to
                gloss through the details, once we are brought up to speed with
                the general content.
              </p>
            </Col>
            <Col md={4}>
              <h2>Upload your own text</h2>
              <span className="badge badge-primary">Coming soon</span>
              <p>
                Paste text or upload your text files. We'll read them back to
                you.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="readme" className="bg-light py-5">
        <Container>
          <h3>Please read before signing up:</h3>
          <ol>
            <li className="my-1">
              The audio files generated are meant for personal use only. Please
              do not distribute copyrighted materials.
            </li>
            <li className="my-1">
              This service is hosted on personal cloud free-tier. The page may
              load slow at certain times.
            </li>
            <li className="my-1">To prevent abuse of the application:</li>
            <ul>
              <li className="my-1">
                You may only keep up to ten(10) converted files at any time.
              </li>
              <li className="my-1">
                You may only upload five(5) times a day, and for a total of
                thirty(30) times in a month.
              </li>
            </ul>
            <li className="my-1">
              Only English conversion is supported currently. Other languages
              will be added in the future.
            </li>
            <li className="my-1">
              You will be requested to <strong>Sign in with Google</strong>,
              which will grant the web application access to the following:
              <ul>
                <li>Your registered name for the google account</li>
                <li>Your registered email</li>
                <li>Your google account id</li>
                <li>Your language preference</li>
                <li>Your profile picture</li>
                <li>
                  Your access and refresh tokens, which are required for the
                  application to read, write, and delete files on your Google
                  Drive. It is required for uploading your audio files to Google
                  Drive.
                </li>
                <li>
                  <strong>
                    A user account will be created using the information above
                    and are kept in our database. You can see them on your
                    profile page. You may request for deletion of your account
                    at any time. Consequently, all your files will be deleted
                    forever too.
                  </strong>
                </li>
              </ul>
              <li>
                Strictly no confidential, illegal, violent, and/or pornographic
                content.
              </li>
            </li>
          </ol>
        </Container>
      </section>

      <section id="signin" className="py-5">
        <Container>
          <Card className="mx-auto my-5" style={{ width: "23rem" }}>
            <Card.Body>
              <Card.Title>Create account / Log in</Card.Title>
              <a className="btn btn-danger btn-block my-5" href="/auth/google">
                <span>
                  <i className="bi bi-google mr-3"></i>
                </span>
                Sign in with Google
              </a>
              <small>
                Note: The application will be requesting for profile information
                (name, email, googleId) and access to read and write files to
                your Google Drive.
              </small>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </div>
  );
};

export default Home;

import React from "react";
import { Container, Image, Row, Col, ListGroup } from "react-bootstrap";

const Home = () => {
  return (
    <>
      <div className="jumbotron">
        <div className="text-center">
          <Image
            fluid
            roundedCircle
            className="w-25"
            src={process.env.PUBLIC_URL + "/image/icons/brand.png"}
            alt="brand-logo"
          />

          <p
            style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
            className="font-weight-bold"
          >
            One Listen
          </p>

          <p style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}>
            Convert web articles to mp3.
          </p>
          <p>
            A web application which converts your web articles into audio files.
            Ideal for readers who want to consume content on-the-go.
          </p>
        </div>
      </div>

      <section id="features" className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10}>
              <ListGroup variant="flush">
                {/* <FileListItem
                  disableActions={true}
                  file={{
                    _id: "60c5f0c8d79bd5a60d22234d",
                    metadata: {
                      title:
                        "SushiSwap (SUSHI): A Community-Centric Evolution of Uniswap",
                      slug: "sushiswap-sushi-a-community-centric-evolution-o",
                      excerpt:
                        "An overview of Chef Nomi’s community-centric SushiSwap, and how it competes with UniSwap using SUSHI coin, its Sushibar LP token system, and BentoBox.",
                      wordCount: 1487,
                      charCount: 9697,
                    },
                    job: {
                      status: "Completed",
                      queue: "None",
                    },
                    sourceUrl:
                      "https://www.gemini.com/cryptopedia/sushiswap-sushi-coin-sushibar-chef-nomi",
                    privateOnly: true,
                    selfLink:
                      "https://storage.googleapis.com/flashcard-6ec1f.appspot.com/60b7a045e340385fe319fbc8/audio/sushiswap-sushi-a-community-centric-evolution-o",
                    resourcePath: "",
                    resourceName: "",
                    viewers: [],
                    kind: "Article",
                    owner: {
                      $oid: "60b7a045e340385fe319fbc8",
                    },
                    createdAt: {
                      $date: "2021-06-13T11:49:28.338Z",
                    },
                    updatedAt: "2021-06-13T11:50:26.162Z",
                  }}
                /> */}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="readme" className="bg-light py-5">
        <Container>
          <p>Disclaimers:</p>
          <ol className="small">
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
              When you <strong>"Sign in with Google"</strong>, which will grant
              the web application access to the following:
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
                {/* <li>
                  <strong>
                    A user account will be created using the information above
                    and are kept in our database. You can see them on your
                    profile page. You may request for deletion of your account
                    at any time. Consequently, all your files will be deleted
                    forever too.
                  </strong>
                </li> */}
              </ul>
              <li>
                Strictly no confidential, illegal, violent, and/or pornographic
                content.
              </li>
            </li>
          </ol>
        </Container>
      </section>
    </>
  );
};

export default Home;

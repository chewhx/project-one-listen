import React from "react";
import { Formik } from "formik";
import axios from "axios";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useAlert } from "react-alert";

const UploadGroup = () => {
  const alert = useAlert();

  const postUrlHandler = async (url) => {
    try {
      const res = await axios.post(`/api/v1/resource/url`, { url });

      alert.success(
        `Link uploaded successfully. ${new Date().toLocaleString("en-SG", {
          dateStyle: "long",
          timeStyle: "long",
        })}\n${res.data.sourceUrl}`
      );
    } catch (err) {
      alert.error(`Error ${err.response.status}: ${err.response.data}`);
      console.error(err.stack);
    }
  };

  return (
    <Row>
      <Col>
        <ol className="pl-4">
          <li>
            Submit url to a blog post or news article. Do not submit the same
            article more than once.
          </li>
          <li>
            Conversion will take place in the background. You may follow the
            status of your article in the list below. This may take from a few
            minutes to an hour, depending on the server.
          </li>
          <li>
            In case of errors, or your article has not been converted after some
            time, delete the item and try again.
          </li>
        </ol>
        <Formik
          onSubmit={async (values, { resetForm }) => {
            await postUrlHandler(values.url);
            resetForm();
          }}
          initialValues={{ url: "" }}
          enableReinitialize={true}
        >
          {({ values, handleChange, handleSubmit }) => {
            return (
              <>
                <Form.Row>
                  <Col xs={12} md={10}>
                    <Form.Control
                      as="input"
                      type="text"
                      id="url"
                      name="url"
                      value={values.url}
                      autoComplete="off"
                      onChange={handleChange}
                      placeholder="E.g. https://www.gemini.com/cryptopedia/compound-finance-defi-crypto"
                    />
                  </Col>
                  <Col xs={12} md={2}>
                    <Button block onClick={handleSubmit}>
                      Upload
                    </Button>
                  </Col>
                </Form.Row>
              </>
            );
          }}
        </Formik>
      </Col>
    </Row>
  );
};

export default UploadGroup;

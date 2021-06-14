import React from "react";
import { Formik } from "formik";
import axios from "axios";
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { useAlert } from "react-alert";

const UploadGroup = () => {
  const alert = useAlert();

  const postFile = async (url) => {
    try {
      const res = await axios.post(`/file`, { url });
      if (res.status === 201) {
        alert.success(
          `Link uploaded successfully. Processing file... ${new Date().toLocaleString(
            "en-SG",
            {
              dateStyle: "long",
              timeStyle: "long",
            }
          )}\n${res.data.sourceUrl}`
        );
      }
    } catch (err) {
      alert.error(err.response.data);
      console.error(err.stack);
    }
  };

  return (
    <Row>
      <Col>
        <ol className="pl-4 mt-5">
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
          onSubmit={(values, { resetForm }) => {
            postFile(values.url);
            resetForm();
          }}
          initialValues={{ url: "" }}
          enableReinitialize={true}
        >
          {({ values, handleChange, handleSubmit }) => {
            return (
              <>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    id="url"
                    name="url"
                    placeholder="E.g. https://www.gemini.com/cryptopedia/compound-finance-defi-crypto"
                    autoComplete="off"
                    value={values.url}
                    onChange={handleChange}
                  />
                  <InputGroup.Append>
                    <Button variant="secondary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <Form.Text className="text-muted">
                  Note: This service does not endorse the distribution of
                  copyrighted materials. For personal use only.
                </Form.Text>
              </>
            );
          }}
        </Formik>
      </Col>
    </Row>
  );
};

export default UploadGroup;

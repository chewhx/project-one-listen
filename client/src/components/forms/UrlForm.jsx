import React from "react";
import { Form, Button, Row } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { Spinner } from "react-bootstrap";
import useResource from "../../hooks/useResource";

const UrlForm = () => {
  const uniqueFormId = String(Date.now());

  const { PostUrl } = useResource()
  const { mutate } = PostUrl();

  // Form validation

  const validationSchema = yup.object().shape({
    [`${uniqueFormId}-url`]: yup
      .string()
      .required("Required")
      .url("Invalid url"),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        [`${uniqueFormId}-url`]: "",
      }}
      onSubmit={async (values, actions) => {
        await mutate({ url: values[`${uniqueFormId}-url`] });
        actions.resetForm();
      }}
      validationSchema={validationSchema}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        handleReset,
        handleBlur,
        errors,
        touched,
        isSubmitting,
      }) => {
        return (
          <Form>
            <Form.Label className="h3" htmlFor={`${uniqueFormId}-url`}>
              Url
            </Form.Label>
            <Form.Control
              id={`${uniqueFormId}-url`}
              name={`${uniqueFormId}-url`}
              type="text"
              value={values[`${uniqueFormId}-url`]}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={
                errors[`${uniqueFormId}-url`] && touched[`${uniqueFormId}-url`]
              }
            />
            {errors[`${uniqueFormId}-url`] && touched[`${uniqueFormId}-url`] ? (
              <Form.Control.Feedback type="invalid">
                {errors[`${uniqueFormId}-url`]}
              </Form.Control.Feedback>
            ) : null}
            <Row
              style={{ maxWidth: "170px" }}
              className="justify-content-around my-3"
            >
              <Button variant="primary" onClick={handleSubmit}>
                {isSubmitting && <Spinner variant="light" size="sm" />}
                Upload
              </Button>
              <Button onClick={handleReset}>Clear</Button>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UrlForm;

import React from "react";
import { Form, Button, Row, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import useResource from "../../hooks/useResource";
import * as yup from "yup";

const TextForm = () => {
  const uniqueFormId = String(Date.now());
  const { mutate } = useResource();

  // Form Validation

  const validationSchema = yup.object().shape({
    [`${uniqueFormId}-title`]: yup
      .string()
      .required("Required")
      .max(100, "Limit to 100 characters"),
    [`${uniqueFormId}-text`]: yup.string().required("Required"),
  });

  // Submit handler

  const onSubmitHandler = async (values, { setSubmitting, resetForm }) => {
    const res = mutate({
      text: values[`${uniqueFormId}-text`],
      title: values[`${uniqueFormId}-title`],
      slug: values[`${uniqueFormId}-title`]
        .replace(/[^a-zA-Z ]/g, "")
        .toLowerCase()
        .split(" ")
        .join("-"),
    });
    if (res) {
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        [`${uniqueFormId}-title`]: "",
        [`${uniqueFormId}-text`]: "",
      }}
      onSubmit={onSubmitHandler}
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
        setFieldValue,
      }) => {
        return (
          <Form>
            <Form.Group className="my-3">
              <Form.Label htmlFor={`${uniqueFormId}-title`} className="h3">
                Title
              </Form.Label>
              <Form.Control
                type="text"
                value={values[`${uniqueFormId}-title`]}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={
                  errors[`${uniqueFormId}-title`] &&
                  touched[`${uniqueFormId}-title`]
                }
              />
              {errors[`${uniqueFormId}-title`] &&
              touched[`${uniqueFormId}-title`] ? (
                <Form.Control.Feedback type="invalid">
                  {errors[`${uniqueFormId}-title`]}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label htmlFor={`${uniqueFormId}-text`} className="h3">
                Text
              </Form.Label>
              <Form.Text>
                Character count:{" "}
                {values && values[`${uniqueFormId}-text`]
                  ? values[`${uniqueFormId}-text`].length
                  : "0"}
              </Form.Text>
              <Form.Control
                id={`${uniqueFormId}-text`}
                name={`${uniqueFormId}-text`}
                as="textarea"
                rows="8"
                value={values[`${uniqueFormId}-text`]}
                onChange={(e) => {
                  setFieldValue([`${uniqueFormId}-text`], e.target.value);
                  if (!values[`${uniqueFormId}-text`]) {
                    setFieldValue(
                      [`${uniqueFormId}-title`],
                      e.target.value.slice(0, 60).replace(/[^a-zA-Z ]/g, "")
                    );
                  }
                }}
                onBlur={handleBlur}
                isInvalid={
                  errors[`${uniqueFormId}-text`] &&
                  touched[`${uniqueFormId}-text`]
                }
              />
              {errors[`${uniqueFormId}-text`] &&
              touched[`${uniqueFormId}-text`] ? (
                <Form.Control.Feedback type="invalid">
                  {errors[`${uniqueFormId}-text`]}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Row
              style={{ maxWidth: "260px" }}
              className="px-2 justify-content-around my-3"
            >
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Spinner animation="border" variant="light" size="sm" />
                )}
                {" Upload"}
              </Button>

              <Button onClick={handleReset}>Clear</Button>

              <Button>Save</Button>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TextForm;

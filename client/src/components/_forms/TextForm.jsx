import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import useResource from "../../hooks/useResource";
import * as yup from "yup";

const TextForm = () => {
  const { PostText } = useResource();
  const { mutate } = PostText();

  // Form Validation

  const validationSchema = yup.object().shape({
    [`title`]: yup
      .string()
      .required("Required")
      .max(100, "Limit to 100 characters"),
    [`text`]: yup.string().required("Required"),
  });

  // Submit handler

  const onSubmitHandler = async (values, { setSubmitting, resetForm }) => {
    const res = mutate({
      text: values[`text`],
      title: values[`title`],
      slug: values[`title`]
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
        [`title`]: "",
        [`text`]: "",
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
              <Form.Label htmlFor={`title`} className="h3">
                Title
              </Form.Label>
              <Form.Control
                id={`title`}
                name={`title`}
                type="text"
                value={values[`title`]}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={errors[`title`] && touched[`title`]}
              />
              {errors[`title`] && touched[`title`] ? (
                <Form.Control.Feedback type="invalid">
                  {errors[`title`]}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label htmlFor={`text`} className="h3">
                Text
              </Form.Label>
              <Form.Text>
                Character count:{" "}
                {values && values[`text`] ? values[`text`].length : "0"}
              </Form.Text>
              <Form.Control
                id={`text`}
                name={`text`}
                as="textarea"
                rows="8"
                value={values[`text`]}
                onChange={(e) => {
                  setFieldValue([`text`], e.target.value);
                  if (!values[`title`]) {
                    setFieldValue(
                      [`title`],
                      e.target.value.slice(0, 60).replace(/[^a-zA-Z ]/g, "")
                    );
                  }
                }}
                onBlur={handleBlur}
                isInvalid={errors[`text`] && touched[`text`]}
              />
              {errors[`text`] && touched[`text`] ? (
                <Form.Control.Feedback type="invalid">
                  {errors[`text`]}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Row
              style={{ maxWidth: "220px" }}
              className="mx-0 justify-content-between my-3"
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
            </Form.Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default TextForm;

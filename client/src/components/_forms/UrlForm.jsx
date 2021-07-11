import React, { useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { Spinner } from "react-bootstrap";
import useResource from "../../hooks/useResource";
import { ModalContext } from "../../providers/ModalProvider";

const UrlForm = () => {
  // Hooks
  const { PostUrl } = useResource();
  const { mutate } = PostUrl();
  const { closeModal } = useContext(ModalContext);

  // Validations
  const validationSchema = yup.object().shape({
    [`url`]: yup.string().required("Required").url("Invalid url"),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        [`url`]: "",
      }}
      onSubmit={async (values, actions) => {
        await mutate({ url: values[`url`] });
        await actions.setSubmitting(false);
        await actions.resetForm();
        closeModal();
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
            <Form.Label className="h3" htmlFor={`url`}>
              URL
            </Form.Label>
            <Form.Control
              id={`url`}
              name={`url`}
              type="text"
              value={values[`url`]}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={errors[`url`] && touched[`url`]}
            />
            {errors[`url`] && touched[`url`] ? (
              <Form.Control.Feedback type="invalid">
                {errors[`url`]}
              </Form.Control.Feedback>
            ) : null}
            <Form.Row
              style={{ maxWidth: "150px" }}
              className="justify-content-between my-3 mx-0"
            >
              <Button variant="primary" onClick={handleSubmit}>
                {isSubmitting && <Spinner variant="light" size="sm" />}
                Upload
              </Button>
              <Button onClick={handleReset}>Clear</Button>
            </Form.Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UrlForm;

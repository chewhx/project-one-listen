import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";

import { Toast } from "react-bootstrap";
import { ToastContext } from "../providers/ToastProvider";

const _Toast = ({ children, toast, ...rest }) => {
  const { removeToast } = useContext(ToastContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);

  return (
    <Toast
      show={true}
      onClose={() => {
        removeToast(toast.id);
      }}
      animation
      {...rest}
    >
      <Toast.Header>
        <strong className="mr-auto">One Listen</strong>
        <small>{new Date(toast.id).toLocaleString("en-SG")}</small>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};

_Toast.propTypes = {
  children: PropTypes.element.isRequired,
  toast: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.any.isRequired,
  }).isRequired,
};

export default _Toast;

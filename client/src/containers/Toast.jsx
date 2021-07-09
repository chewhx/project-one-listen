import React, { useContext, useEffect } from "react";
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
        <small>
          {new Date().toLocaleString("en-SG", {
            dateStyle: "short",
            timeStyle: "long",
          })}
        </small>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};

export default _Toast;

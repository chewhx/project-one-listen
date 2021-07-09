import React from "react";
import { Alert } from "react-bootstrap";

const AlertTemplateDismissible = ({ style, options, message, close }) => {
  return (
    <Alert
      variant={
        options.type === "success"
          ? "success"
          : options.type === "info"
          ? "info"
          : options.type === "error"
          ? "danger"
          : "info"
      }
      style={style}
      onClose={() => close()}
      dismissible
    >
      <p>{message}</p>
    </Alert>
  );
};

export default AlertTemplateDismissible;

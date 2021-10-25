import React, { useState } from "react";
import { Button } from "react-bootstrap";

const DyButton = ({
  doneStatus,
  successText,
  failureText,
  label,
  variant,
  doAction,
  undoAction,
  ...props
}) => {
  const [done, setDone] = useState(doneStatus || false);
  const onClickHandler = async () => {
    try {
      if (done === true) {
        await undoAction();
        setDone(false);
      }
      if (done === false || done === "error") {
        await doAction();
        setDone(true);
      }
    } catch (e) {
      setDone("error");
    }
  };

  return (
    <Button
      variant={
        done === true
          ? "success"
          : done === false
          ? "warning"
          : done === "error"
          ? "danger"
          : variant || "primary"
      }
      onClick={onClickHandler}
      {...props}
      disabled={done === "isLoading"}
    >
      {done === "isLoading"
        ? "Loading..."
        : done === true
        ? "Unsubscribe"
        : done === false
        ? "Subscribe"
        : done === "error"
        ? "Error"
        : ""}
    </Button>
  );
};

export default DyButton;

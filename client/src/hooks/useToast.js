import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import Toast from "../containers/Toast";

const useToast = () => {
  const [toastContent, setToastContent] = useState([]);

  const addToast = useCallback((content) => {
    setToastContent((prev) => [...prev, { id: String(Date.now()), content }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToastContent((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const ToastContainer = ({ toasts }) => {
    const container = document.querySelector("#__toast-root__");
    return ReactDOM.createPortal(
      <>
        {toasts?.map((each, idx) => (
          <Toast
            key={`toast-${each.id}-${idx}`}
            id={`toast-${each.id}-${idx}`}
            toast={each}
          >
            {each.content}
          </Toast>
        ))}
      </>,
      container
    );
  };

  return { addToast, removeToast, toastContent, ToastContainer };
};

export default useToast;

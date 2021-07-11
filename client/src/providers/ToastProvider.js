import { createContext } from "react";
import PropTypes from "prop-types";

import useToast from "../hooks/useToast";

export const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const { toastContent, ToastContainer, ...rest } = useToast();

  return (
    <ToastContext.Provider value={{ toastContent, ToastContainer, ...rest }}>
      <ToastContainer toasts={toastContent} />
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ToastProvider;

// Credit: https://dev.to/alexandprivate/your-next-react-modal-with-your-own-usemodal-hook-context-api-3jg7

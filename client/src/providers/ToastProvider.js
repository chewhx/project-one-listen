import { createContext } from "react";
import useToast from "../hooks/useToast";

export const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const { addToast, removeToast, toastContent, ToastContainer } = useToast();
  console.log(toastContent);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toastContent }}>
      <ToastContainer toasts={toastContent} />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;

// Credit: https://dev.to/alexandprivate/your-next-react-modal-with-your-own-usemodal-hook-context-api-3jg7

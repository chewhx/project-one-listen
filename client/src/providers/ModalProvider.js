import { createContext } from "react";
import useModal from "../hooks/useModal";
import Modal from "../containers/Modal";

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const { modal, handleModal, modalContent } = useModal();
  return (
    <ModalContext.Provider value={{ modal, handleModal, modalContent }}>
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export default ModalProvider;

// Credit: https://dev.to/alexandprivate/your-next-react-modal-with-your-own-usemodal-hook-context-api-3jg7

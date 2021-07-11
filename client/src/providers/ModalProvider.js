import { createContext } from "react";
import PropTypes from "prop-types";

import useModal from "../hooks/useModal";

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const { ModalContainer, ...rest } = useModal();
  return (
    <ModalContext.Provider value={{ ModalContainer, ...rest }}>
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ModalProvider;

// Credit: https://dev.to/alexandprivate/your-next-react-modal-with-your-own-usemodal-hook-context-api-3jg7

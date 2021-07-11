import { useState } from "react";
import ReactDOM from "react-dom";

import Modal from "../containers/Modal";

const useModal = () => {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState();

  const closeModal = () => {
    setModal(false);
  };

  const handleModal = (content) => {
    setModal((prev) => !prev);
    if (content) {
      setModalContent(content);
    }
  };

  const ModalContainer = () => {
    const container = document.querySelector("#__modal-root__");
    return ReactDOM.createPortal(<Modal>{modalContent}</Modal>, container);
  };

  return { modal, handleModal, modalContent, closeModal, ModalContainer };
};

export default useModal;

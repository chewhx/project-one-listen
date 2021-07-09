import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Modal } from "react-bootstrap";
import { ModalContext } from "../providers/ModalProvider";

const _Modal = () => {
  const { modalContent, handleModal, modal } = useContext(ModalContext);

  const container = document.querySelector("#__modal-root__");

  return ReactDOM.createPortal(
    <Modal show={modal} onHide={handleModal}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>{modalContent}</Modal.Body>
    </Modal>,
    container
  );
};

export default _Modal;

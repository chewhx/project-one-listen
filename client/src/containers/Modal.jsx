import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { ModalContext } from "../providers/ModalProvider";

const _Modal = ({ children }) => {
  const { handleModal, modal } = useContext(ModalContext);

  return (
    <Modal show={modal} onHide={handleModal}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default _Modal;

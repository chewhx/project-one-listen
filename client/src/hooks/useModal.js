import { useState } from "react";

const useModal = () => {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(
    "Lorem modal content from State"
  );
  

  const handleModal = (content) => {
    setModal((prev) => !prev);
    if (content) {
      setModalContent(content);
    }
  };

  return { modal, handleModal, modalContent };
};

export default useModal;

import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button colorScheme="blue" onClick={handleOpen}>
        How To?
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to shuffle your tests</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text fontSize="2xl">Test Sheet</Text>
            <p>
              The first input is for your first test. See the doc for the proper
              formatting. Questions should be numbered 1. 2. etc. Choices should
              be lettered a. b. c. d. with a tab before.
            </p>
            <Text fontSize="2xl">Answer Key</Text>
            <p>
              {" "}
              The second input is for your answer key. See the doc for the
              proper formatting. Answers should be numbered with a dot right
              after and the capital letter that corresponds with the answer. Ex:
              1. B{" "}
            </p>
            <h3>Features: </h3>
            <p>
              Choose how many copies you want in the copies input. The Rephrase
              question will use machine learning and artificial intelligence to
              rephrase the question.
            </p>
            <Text fontSize="2xl">Download</Text>
            <p>
              Click the generate files button and wait for the files to be
              generated. Then click the download files button to download a zip
              file with all the tests and the corresponding answer keys.
            </p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button>
              <a href="https://docs.google.com/document/d/1hVpno6GRQ8BEszfdiwvt3F-zwq-Jhk_xDMkuql3hB1s/edit?usp=sharing">
                Samle Doc Link
              </a>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InfoModal;

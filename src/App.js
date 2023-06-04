import { Input, Text, Button } from "@chakra-ui/react";
import "./App.css";
import JSZip from "jszip";
import React, { useState } from "react";
import { saveAs } from "file-saver";
import AnswerKey from "./AnswerKeys";
import { useTest } from "./TestContext";
function App() {
  let { files } = useTest();

  const { createQuestionFile } = useTest();
  const { questions, setQuestions } = useTest();
  const [copies, setCopies] = useState(1);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = async (e) => {
      const contents = e.target.result;
      await parseTestFile(contents);
    };
    reader.readAsText(file);
  };

  const parseTestFile = (fileContents) => {
    const lines = fileContents.split("\n");
    const questionRegex = /^\d+\.\s.*$/;
    const choiceRegex = /^[a-d]\.\s.*$/;
    let currentQuestion = null;
    let newQuestions = [];
    let choices = [];
    for (let line of lines) {
      line = line.trim();

      let type = "";
      if (questionRegex.test(line)) {
        type = "Question";
      } else if (choiceRegex.test(line)) {
        type = "Choice";
      } else {
        console.log("Not the proper line");
        continue;
      }
      line = line.replace(" ", "");
      line = line.substring(line.indexOf(".") + 1);

      if (type === "Question") {
        if (currentQuestion == null) {
          currentQuestion = line;
        } else {
          const QuestionObj = {
            Question: currentQuestion,
            choices: choices,
          };

          newQuestions.push(QuestionObj);

          choices = [];
          currentQuestion = line;
        }
      } else {
        choices.push(line);
      }
    }

    newQuestions.push({
      Question: currentQuestion,
      choices: choices,
    });
    setQuestions(newQuestions);
  };

  const onButtonClick = () => {
    let zip = new JSZip();

    for (let i = 0; i < copies; i++) {
      createQuestionFile(questions);
    }
    for (let i = 0; i < files.length; i++) {
      zip.file(`test${i + 2}.txt`, files[i]);
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "tests.zip");
    });
  };
  return (
    <div>
      <Text fontSize="6xl">Test Parser</Text>
      <Input
        label="Test File: "
        type="file"
        placehodler="Test"
        onChange={handleFileUpload}
      />
      <AnswerKey />
      <Input
        label="Copies: "
        type="number"
        min="1"
        max="6"
        onChange={(e) => {
          setCopies(e.target.value);
        }}
        value={copies}
      />

      <Button onClick={onButtonClick}>Submit</Button>
    </div>
  );
}

export default App;

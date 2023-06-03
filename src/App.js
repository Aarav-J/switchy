import { Input, Text, Button } from "@chakra-ui/react";
import "./App.css";
import JSZip from "jszip";
import React, { useState } from "react";
import { saveAs } from "file-saver";
import AnswerKey from "./AnswerKeys";
function App() {
  const [questions, setQuestions] = useState([]);
  let files = [];
  const [copies, setCopies] = useState(1);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const contents = e.target.result;
      await parseTestFile(contents);
    };
    reader.readAsText(file);
  };

  const parseTestFile = (fileContents) => {
    console.log(fileContents);
    const lines = fileContents.split("\n");
    const questionRegex = /^\d+\.\s.*$/;
    const choiceRegex = /^[a-d]\.\s.*$/;
    let currentQuestion = null;
    let newQuestions = [];
    let choices = [];
    for (let line of lines) {
      line = line.trim();
      console.log(line);
      // console.log(line[0]);
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
      console.log(type + ": " + line);
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

  const changeTheOrder = (questions) => {
    let array = questions;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    console.log(array);
    return array;
  };

  const createFile = (questions) => {
    questions = changeTheOrder(questions);
    console.log(questions);
    let text = "";

    for (let i = 0; i < questions.length; i++) {
      // console.log(questions[i]);
      text += `${i + 1}. ${questions[i].Question}\n`;
      questions[i].choices = changeTheOrder(questions[i].choices);
      for (let j = 0; j < questions[i].choices.length; j++) {
        text +=
          " " +
          String.fromCharCode(65 + j) +
          ". " +
          questions[i].choices[j] +
          "\n";
      }
    }
    console.log(text);
    // const filename = "test2.txt";
    console.log("Created");
    // const element = document.createElement("a");
    // const file = new Blob([text], { type: "text/plain" });
    // element.href = URL.createObjectURL(file);
    // element.download = filename;
    // document.body.appendChild(element);
    console.log(text);
    files.push(text);
  };

  const onButtonClick = () => {
    console.log(copies);
    let zip = new JSZip();

    for (let i = 0; i < copies; i++) {
      createFile(questions);
    }
    for (let i = 0; i < files.length; i++) {
      zip.file(`test${i + 2}.txt`, files[i]);
    }
    console.log(files);
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
          console.log(copies);
        }}
        value={copies}
      />

      <Button onClick={onButtonClick}>Submit</Button>
    </div>
  );
}

export default App;

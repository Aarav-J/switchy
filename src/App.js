import { Input, Text, Button } from "@chakra-ui/react";
import "./App.css";

import React, { useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      const parsedQuestions = parseTestFile(contents);
      // setQuestions(parsedQuestions);
    };

    reader.readAsText(file);
  };

  const parseTestFile = (fileContents) => {
    console.log(fileContents);
    const lines = fileContents.split("\n");
    const questionRegex = /^\d+\.\s.*$/;
    const choiceRegex = /^[a-d]\.\s.*$/;
    let currentQuestion = null;

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
          questions.push(QuestionObj);
          choices = [];
          currentQuestion = line;
        }
      } else {
        choices.push(line);
      }
    }
    questions.push({
      Question: currentQuestion,
      choices: choices,
    });
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
      console.log(questions[i]);
      text += `${i + 1}. ${questions[i].Question}\n`;

      for (let j = 0; j < questions[i].choices.length; j++) {
        text +=
          "\t" +
          String.fromCharCode(65 + j) +
          ". " +
          questions[i].choices[j] +
          "\n";
      }
    }
    const filename = "test2.txt";
    console.log("Created");
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
  };
  return (
    <div>
      <Text fontSize="6xl">Test Parser</Text>
      <Input type="file" placehodler="Test" onChange={handleFileUpload} />
    </div>
  );
}

export default App;

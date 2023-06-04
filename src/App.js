import { Input, Text, Button, Checkbox } from "@chakra-ui/react";
import "./App.css";
import JSZip from "jszip";
import React, { useEffect, useState, useTimeout } from "react";
import { saveAs } from "file-saver";
import AnswerKey from "./AnswerKeys";
import { useTest } from "./TestContext";

function App() {
  let { questionFiles, answerFiles } = useTest();
  const { checked, setChecked } = useTest();
  const { createFiles } = useTest();
  const { questions, setQuestions } = useTest();
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    setChecked(0);
  }, []);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const done = () => {
    setFinished(true);
    setLoading(false);
  };
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
      console.log(line);
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

  const onGenerate = async () => {
    setLoading(true);
    for (let i = 0; i < copies; i++) {
      await createFiles(questions);
    }

    console.log(copies);
    // let promise_array = Array.apply(null, Array(copies)).map(async () =>
    //   createFiles(questions)
    // );
    // console.log(promise_array);
    // await Promise.all(promise_array);

    // await Promise.all(
    //   Array(copies)
    //     .fill()
    //     .map(() => createFiles(questions))
    // );
    delay(3000 * copies);
    done();
  };

  const onButtonClick = async () => {
    let zip = new JSZip();
    console.log(questionFiles);
    for (let i = 0; i < questionFiles.length; i++) {
      let folder = zip.folder(`test${i + 2}`);
      let text = "Version: " + (i + 2) + "\n";
      folder.file(`answer${i + 2}.txt`, text + answerFiles[i]);
      folder.file(`test${i + 2}.txt`, text + questionFiles[i]);
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "tests.zip");
    });
  };
  return (
    <div className="body">
      <div className="App">
        <Text className="Text" fontSize="6xl">
          Shuffly
        </Text>
        <label htmlFor="testFile">Upload Test File: </label>
        <Input
          name="testFile"
          id="testFile"
          accept=".txt"
          className="Input"
          label="Test File: "
          type="file"
          placehodler="Test"
          onChange={handleFileUpload}
        />

        <AnswerKey />
        <label htmlFor="copies">Copies: </label>
        <Input
          name="copies"
          id="copies"
          className="Input"
          label="Copies: "
          type="number"
          min="1"
          max="6"
          onChange={(e) => {
            setCopies(e.target.value);
          }}
          value={copies}
        />

        <Checkbox
          className="Checkbox"
          value={checked}
          onChange={() => {
            checked === 0 ? setChecked(1) : setChecked(0);
          }}
        >
          Rephrase Questions
        </Checkbox>
        {!finished && !loading && (
          <Button colorScheme="green" className="Button" onClick={onGenerate}>
            Generate Files
          </Button>
        )}
        {loading && <Text>Generating Files...</Text>}
        {!loading && finished && (
          <Button colorScheme="blue" className="Button" onClick={onButtonClick}>
            Download Files
          </Button>
        )}
      </div>
    </div>
  );
}

export default App;

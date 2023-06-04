import { createContext, useState, useContext } from "react";

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  let files = [];
  let answers = [];
  const [questions, setQuestions] = useState([]);
  const changeTheOrder = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    console.log(array);
    return array;
  };

  const createQuestionFile = (questions) => {
    questions = changeTheOrder(questions);
    console.log(questions);
    let text = "";

    for (let i = 0; i < questions.length; i++) {
      text += `${i + 1}. ${questions[i].Question}\n`;
      //   const answer =
      // questions[i].choices[questions[i].answer.charCodeAt(0) - 65];
      console.log(questions[i].answer.charCodeAt(0));
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

    // const filename = "test2.txt";

    // const element = document.createElement("a");
    // const file = new Blob([text], { type: "text/plain" });
    // element.href = URL.createObjectURL(file);
    // element.download = filename;
    // document.body.appendChild(element);
    console.log(text);
    files.push(text);
  };
  const setAnswers = (answers) => {
    this.answers = answers;
  };
  const value = {
    files,
    answers,
    setAnswers: (answers) => setAnswers(answers),
    createQuestionFile: (questions) => createQuestionFile(questions),
    questions,
    setQuestions: (questions) => setQuestions(questions),
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

export function useTest() {
  const context = useContext(TestContext);

  return context;
}

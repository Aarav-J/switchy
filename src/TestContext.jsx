import { createContext, useState, useContext, useEffect } from "react";
import getResponse from "./chatgpt";

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  let questionFiles = [];
  let answers = [];
  let answerFiles = [];
  const [checked, setChecked] = useState(0);
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
  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const generateNewQuestions = async (questions) => {
    let codeQuestions = questions;
    let i = 0;
    for (let question of questions) {
      // const newQuestion = getResponse(question.Question);
      const newObj = {
        Question:
          i % 2 === 0
            ? await getResponse(question.Question)
            : question.Question,
        choices: question.choices,
        answer: question.answer,
      };
      console.log(i, newObj);
      codeQuestions[i] = newObj;
      i++;
    }
    return codeQuestions;
  };
  const createFiles = async (questions) => {
    let codeQuestions;
    if (checked === 1) {
      console.log("checked");
      codeQuestions = changeTheOrder(await generateNewQuestions(questions));
    } else {
      console.log("not checked");
      codeQuestions = changeTheOrder(questions);
    }

    console.log(questions);
    let text = "";
    console.log("Code Questions: " + JSON.stringify(codeQuestions));
    for (let i = 0; i < codeQuestions.length; i++) {
      text += `${i + 1}. ${codeQuestions[i].Question}\n`;
      //   const answer =
      const answer =
        codeQuestions[i].choices[codeQuestions[i].answer.charCodeAt(0) - 65];
      console.log(answer);

      codeQuestions[i].choices = changeTheOrder(codeQuestions[i].choices);

      const choices = codeQuestions[i].choices;
      let j = 0;
      for (let choice of choices) {
        if (choice === answer) {
          console.log(choices);
          console.log(choice, answer, j);
          const newQuestionObj = {
            Question: questions[i].Question,
            choices: questions[i].choices,
            answer: String.fromCharCode(65 + j),
          };
          console.log(newQuestionObj);

          codeQuestions[i] = newQuestionObj;
          console.log(codeQuestions);
        }
        j++;
      }
      setQuestions(codeQuestions);
      for (let j = 0; j < questions[i].choices.length; j++) {
        text +=
          " " +
          String.fromCharCode(65 + j) +
          ". " +
          questions[i].choices[j] +
          "\n";
      }
    }

    let answerText = "";
    let i = 0;
    for (const question of questions) {
      answerText += `${i + 1}. ${question.answer}\n`;
      i++;
    }
    answerFiles.push(answerText);
    console.log(questions);
    console.log(text);
    questionFiles.push(text);
  };

  const value = {
    questionFiles,
    checked,
    setChecked: (checked) => setChecked(checked),
    answers,
    answerFiles,
    createFiles: (questions) => createFiles(questions),
    questions,
    setQuestions: (questions) => setQuestions(questions),
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

export function useTest() {
  const context = useContext(TestContext);

  return context;
}

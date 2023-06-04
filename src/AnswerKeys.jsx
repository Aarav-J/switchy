import { Input } from "@chakra-ui/react";
import { useTest } from "./TestContext";
const AnswerKey = () => {
  const { questions, setQuestions } = useTest();
  let { answers } = useTest();
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const contents = e.target.result;
      await parseAnswerKey(contents);
    };
    reader.readAsText(file);
  };
  const parseAnswerKey = (content) => {
    const lines = content.split("\n");
    for (let line of lines) {
      line = line.trim();
      answers.push(line[line.length - 1]);
    }
    let newQuestions = [];
    let i = 0;
    for (let question of questions) {
      newQuestions.push({
        Question: question.Question,
        choices: question.choices,
        answer: answers[i],
      });
      i++;
    }
    setQuestions(newQuestions);
  };
  return (
    <>
      <label htmlFor="answerFile">Upload Answer Key: </label>
      <Input
        id="answerFile"
        name="answerFile"
        accept=".txt"
        className="Input"
        label="Test File: "
        type="file"
        placehodler="Test"
        onChange={handleFileUpload}
      />
    </>
  );
};
export default AnswerKey;

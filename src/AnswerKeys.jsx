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
      line.replace(" ", "");
      answers.push(line.substring(line.indexOf(".") + 1));
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
    <Input
      label="Test File: "
      type="file"
      placehodler="Test"
      onChange={handleFileUpload}
    />
  );
};
export default AnswerKey;

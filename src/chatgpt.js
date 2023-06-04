import {Configuration, OpenAIApi} from 'openai';
const getResponse = async(question) => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    organization: process.env.REACT_APP_ORGANIZATION_KEY,

  });
  const openai = new OpenAIApi(configuration);

  const complete_options = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are supposed to rephrase the following sentence:',
      },
      {
        role: 'user',
        content: 'What is the capital of France?',
      },
      {
        role: 'assistant',
        content: 'Which city serves as the capital of France?',
      },
      {
        role: 'user',
        content: 'What is the capital of France?',
      },
      {
        role: 'assistant',
        content: 'Which city is designated as the capital of France?'
      },
      {role: 'user', content: `another way to rephrase: ${question}`},
    ],
    temperature: 0.9,
  };
  const res = await openai.createChatCompletion(complete_options)
  console.log(res);
  return res.data['choices'][0]['message']['content'];
  ;
};


export default getResponse;

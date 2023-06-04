import React from 'react';
import ReactDOM from 'react-dom/client';
import {TestProvider} from './TestContext';
import App from './App';
import {ChakraProvider} from '@chakra-ui/react';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <TestProvider>
    <React.StrictMode><ChakraProvider>
      <App /></ChakraProvider>
    </React.StrictMode>
  </TestProvider>);

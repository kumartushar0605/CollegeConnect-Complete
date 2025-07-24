import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  ChakraProvider,
  extendTheme,
  ColorModeScript
} from '@chakra-ui/react';
import App from './App';
import ColorModeSwitcher from './ColorModeSwitcher';

// 1. Theme config to set initial color mode
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// 2. Extend Chakra's theme with the config
const theme = extendTheme({ config });

// 3. Create global context if needed
export const Context = createContext();

// 4. Wrap App with context and ChakraProvider
const AppWrapper = () => {
  const [studentt, setStudentt] = useState({});
  const [teacherr, setTeacherr] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [TeIsAuthenticated, setTeIsAuthenticated] = useState(false);

  return (
    <Context.Provider
      value={{
        studentt,
        setStudentt,
        teacherr,
        setTeacherr,
        isAuthenticated,
        setIsAuthenticated,
        TeIsAuthenticated,
        setTeIsAuthenticated,
      }}
    >
      {/* Ensure correct initial color mode is set */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <ColorModeSwitcher />
        <App />
      </ChakraProvider>
    </Context.Provider>
  );
};

// 5. Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppWrapper />);

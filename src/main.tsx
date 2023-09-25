import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { AppStateProvider } from './state/AppStateContext.tsx';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="light" />
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </ChakraProvider>
  </React.StrictMode>,
);

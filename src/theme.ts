import { extendTheme } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './index.css';

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        color: props.colorMode === 'light' ? 'gray.800' : 'white',
      },
    }),
  },
});

export default theme;

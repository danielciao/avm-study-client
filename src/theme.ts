import { extendTheme } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import './index.css';

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      html: {},
      body: {
        color: props.colorMode === 'dark' ? 'white' : 'gray.600',
        scrollbarWidth: 'thin',
        scrollbarColor:
          props.colorMode === 'dark'
            ? 'gray.700 gray.900'
            : 'gray.400 gray.100',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: props.colorMode === 'dark' ? 'gray.900' : 'gray.100',
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.300',
        borderRadius: '20px',
        border: `3px solid ${
          props.colorMode === 'dark' ? 'gray.900' : 'gray.100'
        }`,
      },
    }),
  },
});

export default theme;

import {
  Box,
  Center,
  Divider,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import 'leaflet/dist/leaflet.css';
import { PropsWithChildren } from 'react';

interface CardProps {
  image?: React.ReactNode;
  label?: string;
  title?: string;
  paddingBlock?: number;
  paddingInline?: number;
  paddingBlockEnd?: number;
}

export const Card: React.FC<PropsWithChildren<CardProps>> = (props) => {
  const {
    image,
    label,
    title,
    children,
    paddingBlock = 6,
    paddingInline = 6,
    paddingBlockEnd = paddingBlock,
  } = props;

  const backgroundColor = useColorModeValue('white', 'gray.900');
  const titleColor = useColorModeValue('gray.700', 'white');

  return (
    <Center paddingInline={4} marginBottom={4}>
      <Box
        bg={backgroundColor}
        overflow="hidden"
        boxShadow="xl"
        rounded="md"
        paddingBlock={paddingBlock}
        paddingInline={paddingInline}
        paddingBlockEnd={paddingBlockEnd}
        flex={1}
      >
        {image && (
          <Box
            h={150}
            bg="gray.100"
            mt={-paddingBlock}
            mx={-paddingInline}
            mb={paddingBlock}
            position="relative"
            overflow="hidden"
          >
            {image}
          </Box>
        )}
        <Stack>
          {label && (
            <Text
              color="green.500"
              textTransform="uppercase"
              fontWeight={800}
              fontSize="sm"
              letterSpacing={1.1}
            >
              {label}
            </Text>
          )}
          {title && (
            <>
              <Heading color={titleColor} fontSize="2xl">
                {title}
              </Heading>
              <Divider />
            </>
          )}
          {children}
        </Stack>
      </Box>
    </Center>
  );
};

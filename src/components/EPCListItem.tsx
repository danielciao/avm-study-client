import { Box, Skeleton, useColorModeValue } from '@chakra-ui/react';

import { EPCItem } from '../types';

export const EPCListItem: React.FC<{
  item: EPCItem;
  isSelected: boolean;
  onClick: () => void;
}> = (props) => {
  const { item, onClick, isSelected } = props;

  const color = useColorModeValue('gray.600', 'white');
  const selectedColor = useColorModeValue('white', 'gray.800');
  const selectedBackground = useColorModeValue('green.500', 'green.200');
  const hoverBackground = useColorModeValue('gray.200', 'gray.700');

  return (
    <Skeleton isLoaded={!!item} fadeDuration={1} flexShrink="0" display="flex">
      <Box
        as="button"
        onClick={onClick}
        height={9}
        alignItems="center"
        paddingInline={2}
        flex={1}
        textAlign="start"
        borderRadius="none"
        border="none"
        fontSize={14}
        fontWeight={400}
        color={isSelected ? selectedColor : color}
        backgroundColor={isSelected ? selectedBackground : 'transparent'}
        _hover={{ color, backgroundColor: hoverBackground }}
      >
        {item?.EPC_ADDRESS}
      </Box>
    </Skeleton>
  );
};

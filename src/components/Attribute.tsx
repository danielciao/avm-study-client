import { ListItem, Text } from '@chakra-ui/react';
import React from 'react';

export const Attribute: React.FC<{ label: string; value: React.ReactNode }> = (
  props,
) => {
  const { label, value } = props;

  return (
    <ListItem fontSize={14}>
      <Text as="span" fontWeight={700}>
        {label}:&nbsp;
      </Text>
      {value}
    </ListItem>
  );
};

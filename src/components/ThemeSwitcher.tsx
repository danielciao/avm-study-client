import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export const ThemeSwitcher: React.FC<Omit<IconButtonProps, 'aria-label'>> = (
  props,
) => {
  const { toggleColorMode } = useColorMode();

  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      aria-label={`Switch to ${text} mode`}
      size="sm"
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      {...props}
    />
  );
};

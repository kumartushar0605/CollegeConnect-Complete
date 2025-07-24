import React from 'react';
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ColorModeSwitcher = () => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  // Hidden by condition
  return (
    <>
      {false && (
        <IconButton
          onClick={toggleColorMode}
          icon={<SwitchIcon />}
          isRound
          size="md"
          aria-label="Toggle color mode"
          position="fixed"
          top="4"
          right="4"
        />
      )}
    </>
  );
};

export default ColorModeSwitcher;

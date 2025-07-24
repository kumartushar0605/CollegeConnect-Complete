import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Center, Text } from '@chakra-ui/react';

const Chapter = () => {
  const { chapterName } = useParams();

  return (
    <Center minH="100vh" bg="gray.100">
      <Box p={8} maxW="600px" borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <Text fontSize="2xl" mb={6} textAlign="center">{chapterName}</Text>
        <Text>
          {/* Chapter content goes here */}
          This is the content for {chapterName}.
        </Text>
      </Box>
    </Center>
  );
};

export default Chapter;

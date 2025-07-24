import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  CloseButton,
  IconButton,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

const Chatwindow = ({ name, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user', timestamp: new Date() }]);
      setInputValue('');
    }
  };

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      position="fixed"
      bottom="70px"
      right="20px"
      width="300px"
      bg="gray.800"
      borderRadius="md"
      boxShadow="lg"
      color="white"
      p={4}
    >
      <HStack justifyContent="space-between" mb={2}>
        <Text fontSize="lg" fontWeight="bold">
          Chat with {name}
        </Text>
        <CloseButton onClick={onClose} color="white" />
      </HStack>
      <VStack spacing={3} align="stretch" maxHeight="300px" overflowY="auto">
        {messages.map((msg, index) => (
          <Box
            key={index}
            alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
            bg={msg.sender === 'user' ? 'teal.500' : 'gray.700'}
            px={3}
            py={2}
            borderRadius="md"
          >
            <Text fontSize="sm">{msg.text}</Text>
            <Text fontSize="xs" color="gray.400">
              {msg.timestamp.toLocaleTimeString()}
            </Text>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </VStack>
      <HStack mt={3}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          bg="gray.700"
          border="none"
          _focus={{ border: 'none', boxShadow: 'outline' }}
        />
        <IconButton
          icon={<ArrowRightIcon />}
          colorScheme="teal"
          onClick={sendMessage}
          _hover={{ bg: 'teal.600' }}
        />
      </HStack>
    </Box>
  );
};

export default Chatwindow;

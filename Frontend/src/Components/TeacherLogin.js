import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useBreakpointValue,
  Link,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';

const MotionBox = motion(Box);

const TeacherLogin = () => {
  const { setTeIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const toast = useToast();

  const formBg = useColorModeValue('white', 'gray.700');
  const buttonBg = useColorModeValue('blue.500', 'blue.300');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.400');
  const inputBg = useColorModeValue('gray.50', 'gray.600');
  const labelColor = useColorModeValue('gray.700', 'gray.300');

  const boxWidth = useBreakpointValue({ base: '90%', md: '500px' });
  const boxHeight = useBreakpointValue({ base: 'auto', md: 'auto' });

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [semester, setSemester] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sem = semester;
      const res = await fetch('https://collegeconnect-backend.onrender.com/Tlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, semester, password }),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast({
          title: "Login successful.",
          description: "Welcome back!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setTeIsAuthenticated(true);
        navigate('/home2', { state: { name, email, sem } });
      } else {
        setMessage(data.message);
        toast({
          title: "Login failed.",
          description: data.message || "Please check your credentials.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      setMessage('Login failed');
      toast({
        title: "Login failed.",
        description: "An error occurred during login. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Center minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <MotionBox
        as="form"
        p={8}
        width={boxWidth}
        borderWidth={1}
        borderRadius="lg"
        height={boxHeight}
        boxShadow="xl"
        bg={formBg}
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition="0.5s ease"
        onSubmit={handleSubmit}
      >
        <Stack spacing={6}>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" textAlign="center" color="blue.500">
            Teacher Login
          </Text>

          <FormControl id="name" isRequired>
            <FormLabel color={labelColor}>Full Name</FormLabel>
            <Input
              placeholder="Your name"
              bg={inputBg}
              value={name}
              onChange={(e) => setName(e.target.value)}
              _focus={{ borderColor: 'blue.400' }}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel color={labelColor}>Email</FormLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              bg={inputBg}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              _focus={{ borderColor: 'blue.400' }}
            />
          </FormControl>

          <FormControl id="semester" isRequired>
            <FormLabel color={labelColor}>Semester</FormLabel>
            <Input
              placeholder="Enter your semester"
              bg={inputBg}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              _focus={{ borderColor: 'blue.400' }}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel color={labelColor}>Password</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              bg={inputBg}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              _focus={{ borderColor: 'blue.400' }}
            />
          </FormControl>

          <Button
            type="submit"
            size="lg"
            bg={buttonBg}
            color="white"
            _hover={{ bg: buttonHoverBg }}
            transition="0.3s ease"
            mt={2}
          >
            Login
          </Button>

          {message && (
            <Text fontSize="sm" color="red.500" textAlign="center" mt={-2}>
              {message}
            </Text>
          )}

          <Text fontSize="sm" color="gray.500" textAlign="center">
            New to platform?{' '}
            <Link color="blue.500" onClick={() => navigate('/ress')} fontWeight="bold">
              Register here
            </Link>
          </Text>
        </Stack>
      </MotionBox>
    </Center>
  );
};

export default TeacherLogin;

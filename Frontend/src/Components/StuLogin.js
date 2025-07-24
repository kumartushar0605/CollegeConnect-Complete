import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
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
import { Context } from '../index';

const MotionBox = motion(Box);

const StuLogin = () => {
  const { setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const toast = useToast();

  const formBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const labelColor = useColorModeValue('gray.700', 'gray.300');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const buttonBg = useColorModeValue('blue.500', 'blue.300');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.400');

  const boxWidth = useBreakpointValue({ base: '90%', md: '450px' });

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

      const res = await fetch('https://collegeconnect-backend.onrender.com/Slogin', {
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
        setIsAuthenticated(true);
        navigate('/page', { state: { name, email, sem } });
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
    <Center minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <MotionBox
        as="form"
        width={boxWidth}
        borderWidth={1}
        borderRadius="md"
        p={8}
        mt={4}
        boxShadow="xl"
        bg={formBg}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition="0.5s ease-in-out"
      >
        <Stack spacing={6}>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" textAlign="center" color="blue.500">
            Student Login
          </Text>

          <FormControl id="name" isRequired>
            <FormLabel color={labelColor}>Name</FormLabel>
            <Input
              bg={inputBg}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel color={labelColor}>Email</FormLabel>
            <Input
              bg={inputBg}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>

          <FormControl id="semester" isRequired>
            <FormLabel color={labelColor}>Semester</FormLabel>
            <Input
              bg={inputBg}
              placeholder="Enter your semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel color={labelColor}>Password</FormLabel>
            <Input
              type="password"
              bg={inputBg}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              _placeholder={{ color: 'gray.500' }}
            />
          </FormControl>

          <Button
            color="white"
            bg={buttonBg}
            _hover={{ bg: buttonHoverBg }}
            size="lg"
            type="submit"
            mt={1}
          >
            Login
          </Button>

          {message && (
            <Text fontSize="sm" color="red.500" textAlign="center" mt={-2}>
              {message}
            </Text>
          )}

          <Text textAlign="center" mt={4} fontSize="sm" color="gray.500">
            New user?{" "}
            <Link onClick={() => navigate('/res')} color="blue.400" fontWeight="bold" textDecoration="underline">
              Register here
            </Link>
          </Text>
        </Stack>
      </MotionBox>
    </Center>
  );
};

export default StuLogin;

import React, { useState } from 'react';
import { Box, Button, Center, FormControl, FormLabel, Input, Stack, Text, Radio, RadioGroup, HStack, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const RateFix = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sem, email } = location.state || '';
  
  const [price, setPrice] = useState(0);
  const [account, setAccount] = useState('');  // Track address input

  const formBg = useColorModeValue('white', 'gray.700');
  const buttonBg = useColorModeValue('blue.500', 'blue.200');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.300');
  
  const boxWidth = useBreakpointValue({ base: '80%', md: '350px' });
  const boxHeight = useBreakpointValue({ base: 'auto', md: 'auto' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://collegeconnect-backend.onrender.com/rate/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({price,account }),
      });

      if (response.ok) {
        alert('Rate successfully set!');
      } else {
        alert('Failed to set the rate. Please try again.');
      }
      navigate("/home2", { state: { sem, email } });
    } catch (error) {
      console.error('Error submitting rate:', error);
      alert('Error connecting to the server.');
    }
  };

  return (
    <Center minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <MotionBox
        p={6}
        width={boxWidth}
        borderWidth={1}
        borderRadius="lg"
        height={boxHeight}
        boxShadow="lg"
        bg={formBg}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition="0.5s"
      >
        <Text fontSize="xl" mb={4} textAlign="center">Set Your Teaching Fees</Text>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>

              <FormControl id="address" isRequired>
                <FormLabel>Enter UPI ID</FormLabel>
                <Input
                  placeholder="Your UPI ID"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </FormControl>
           
                <FormControl id="inrPrice" isRequired>
                  <FormLabel>Fees per Session - INR</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter INR rate"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </FormControl>
               

            <Button
              type="submit"
              bg={buttonBg}
              color="white"
              size="md"
              mt={4}
              _hover={{ bg: buttonHoverBg }}
              transition="0.3s"
            >
              Continue
            </Button>
          </Stack>
        </form>
      </MotionBox>
    </Center>
  );
};

export default RateFix;

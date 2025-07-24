import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  keyframes,
  useColorModeValue
} from '@chakra-ui/react';
import PaymentForm from './PaymentForm';
import PaymentProcessor from './PaymentProcessor';
import PaymentSuccess from './PaymentSuccess';
import { paymentApi } from '../services/paymentApi';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



// Define keyframes for pulse animation
const pulse = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
`;

function CheckoutPage() {
  const [currentState, setCurrentState] = useState('processing');
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    amount: '',
    transactionId: '',
    upiProvider: '@ybl',
  });
  const [payment, setPayment] = useState('NO');

  // Color mode values
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, blue.900, purple.900, pink.900)'
  );
  const decorationColor1 = useColorModeValue('blue.200', 'blue.600');
  const decorationColor2 = useColorModeValue('purple.200', 'purple.600');
  const decorationColor3 = useColorModeValue('pink.200', 'pink.600');
  const navigate = useNavigate();
  
  const location = useLocation();
  const { name, sec, email, _id, readyId, account, price } = location.state || {};

  // Check payment status and redirect if payment is YES
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`https://collegeconnect-backend.onrender.com/address/${email}`);
        const result = await response.json();
        
        if (response.ok) {
          setPayment(result.payment);
          
          // If payment is YES, redirect to accept page
          if (result.payment === 'YES') {
            navigate("/accept");
          }
        } else {
          console.error('Failed to fetch payment status');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    // Only check payment status if we have an email
    if (email) {
      checkPaymentStatus();
      
      // Set up polling to check payment status every 3 seconds
      const interval = setInterval(checkPaymentStatus, 3000);
      
      // Clear interval on component unmount
      return () => clearInterval(interval);
    }
  }, [email, navigate]);

  const handlePaymentSuccess = (transactionId) => {
    setPaymentData(prev => ({ ...prev, transactionId }));
    setCurrentState('success');
  };

  const handleNewPayment = () => {
    setPaymentData({ phoneNumber: '', amount: '', transactionId: '', upiProvider: '@ybl' });
    setCurrentState('form');
  };

  const handleCancelPayment = () => {
    navigate("/accept");
  };

  // Handle page visibility change to detect return from UPI app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentState === 'processing') {
        // User returned to the page - likely from UPI app
        console.log('User returned to page - checking payment status');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentState]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (currentState !== 'form') {
        // Allow natural navigation but don't force reset during payment
        if (currentState === 'success') {
          setCurrentState('form');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentState]);

  // // Auto-redirect to home after successful payment (optional)
  // useEffect(() => {
  //   if (currentState === 'success') {
  //     // Optional: Auto-redirect to form after 10 seconds
  //     const redirectTimer = setTimeout(() => {
  //       handleNewPayment();
  //     }, 10000);

  //     return () => clearTimeout(redirectTimer);
  //   }
  // }, [currentState]);

  return (
    <Flex
      minH="100vh"
      bgGradient={bgGradient}
      align="center"
      justify="center"
      p={4}
      position="relative"
    >
      <Container maxW="md" w="full">
       
        
        {currentState === 'processing' && (
          <PaymentProcessor
           Name={name}
            Email={email}
            amount={price}
            upiProvider={account}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancelPayment}
          />
        )}
        
        {currentState === 'success' && (
          <PaymentSuccess
            Email={email}
            amount={price}
            upiProvider={account}
            transactionId={paymentData.transactionId}
            teacherId={email}
          />
        )}
      </Container>
      
      {/* Background decoration */}
      <Box
        position="fixed"
        inset={0}
        pointerEvents="none"
        overflow="hidden"
        zIndex={-1}
      >
        <Box
          position="absolute"
          top="25%"
          left="25%"
          w={{ base: "32", md: "64" }}
          h={{ base: "32", md: "64" }}
          bg={decorationColor1}
          borderRadius="full"
          mixBlendMode="multiply"
          filter="blur(40px)"
          opacity={0.2}
          animation={`${pulse} 2s ease-in-out infinite`}
        />
        <Box
          position="absolute"
          top="33%"
          right="25%"
          w={{ base: "32", md: "64" }}
          h={{ base: "32", md: "64" }}
          bg={decorationColor2}
          borderRadius="full"
          mixBlendMode="multiply"
          filter="blur(40px)"
          opacity={0.2}
          animation={`${pulse} 2s ease-in-out infinite 1s`}
        />
        <Box
          position="absolute"
          bottom="25%"
          left="33%"
          w={{ base: "32", md: "64" }}
          h={{ base: "32", md: "64" }}
          bg={decorationColor3}
          borderRadius="full"
          mixBlendMode="multiply"
          filter="blur(40px)"
          opacity={0.2}
          animation={`${pulse} 2s ease-in-out infinite 2s`}
        />
      </Box>
    </Flex>
  );
}

export default CheckoutPage;
// Enhanced Chakra UI payment processor component with improved UI

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Text, Heading, VStack, HStack, Icon, Button,
  Image, useClipboard, useToast, Alert, AlertIcon,
  Divider, Badge, Flex, Circle, Progress, Skeleton,
  Container, useColorModeValue
} from '@chakra-ui/react';
import {
  ArrowBackIcon, RepeatIcon, CopyIcon, CheckCircleIcon, InfoIcon, PhoneIcon,
  TimeIcon, WarningIcon, ViewIcon, StarIcon, LockIcon
} from '@chakra-ui/icons';
import QRCode from 'qrcode';

const PaymentProcessor = ({
  Name,
  Email,
  amount,
  upiProvider,
  onSuccess,
  onCancel,
}) => {
  const [status, setStatus] = useState('processing');
  const [countdown, setCountdown] = useState(300);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [upiLink, setUpiLink] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const pollingIntervalRef = useRef(null);

  const toast = useToast();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const { onCopy } = useClipboard(upiLink);

  // Color mode values
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.800, blue.900, purple.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const formatPhoneNumber = (phone) => `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

  const startPaymentPolling = () => {
    if (pollingIntervalRef.current) return;

    pollingIntervalRef.current = setInterval(async () => {
      if (showConfirmation) {
        stopPaymentPolling();
        const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        onSuccess(txnId);
      }
    }, 3000);
  };

  const stopPaymentPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handlePaymentCompleted = () => {
    stopPaymentPolling();
    const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    onSuccess(txnId);
  };

  const copyLink = () => {
    onCopy();
    toast({
      title: 'Copied Successfully!',
      description: 'UPI link has been copied to your clipboard.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const openUpiApp = () => {
    window.location.href = upiLink;
  };
  
  useEffect(() => {
    const generateUPILink = () => {
      const upiId = upiProvider;
      const payeeName = `User ${Email}`;
      const note = 'Payment via QuickPay';
      return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    };

    const initiatePayment = async () => {
      const link = generateUPILink();
      setUpiLink(link);

      if (isMobile) {
        window.location.href = link;
        setTimeout(() => {
          setStatus('waiting');
          setTimeout(() => startPaymentPolling(), 5000);
        }, 2000);
      } else {
        try {
          const qr = await QRCode.toDataURL(link);
          setQrCodeUrl(qr);
          setStatus('qr-generated');
        } catch {
          setStatus('error');
        }
      }
    };

    initiatePayment();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowConfirmation(true);
          stopPaymentPolling();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      stopPaymentPolling();
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && (status === 'waiting' || status === 'qr-generated')) {
        setTimeout(() => setShowConfirmation(true), 1000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [status]);

  useEffect(() => {
    if (countdown === 0) {
      stopPaymentPolling();
      onSuccess('form');
      return;
    }

    const timerr = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerr);
  }, [countdown, stopPaymentPolling, onSuccess]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return RepeatIcon;
      case 'qr-generated':
        return ViewIcon;
      case 'waiting':
        return PhoneIcon;
      case 'error':
        return WarningIcon;
      default:
        return RepeatIcon;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'blue';
      case 'qr-generated':
        return 'green';
      case 'waiting':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'blue';
    }
  };

  const progressValue = ((300 - countdown) / 300) * 100;

  return (
    <Container maxW="md" px={4}>
      <Box
        bg={cardBg}
        shadow="2xl"
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        position="relative"
      >
        {/* Header with gradient */}
        <Box
          bgGradient="linear(135deg, blue.500, purple.600)"
          p={6}
          color="white"
          position="relative"
        >
          <VStack spacing={4} align="center">
            <Circle
              size="80px"
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              border="2px solid"
              borderColor="whiteAlpha.300"
            >
              <Icon 
                as={getStatusIcon()} 
                boxSize={8} 
                color="white"
                className={status === 'processing' ? 'animate-spin' : ''}
              />
            </Circle>
            
            <VStack spacing={2}>
              <Heading size="lg" fontWeight="700" textAlign="center">
                {{
                  processing: 'Preparing Payment',
                  waiting: 'Complete Payment',
                  'qr-generated': 'Scan QR Code',
                  error: 'Payment Error'
                }[status]}
              </Heading>
              
              <Text fontSize="sm" opacity={0.9} textAlign="center" maxW="250px">
                {{
                  processing: 'Setting up your secure payment gateway',
                  waiting: 'Complete the payment in your UPI app and return here',
                  'qr-generated': 'Use your mobile UPI app to scan and pay',
                  error: 'Something went wrong with the payment process'
                }[status]}
              </Text>
            </VStack>

            {/* Device indicator */}
            <HStack
              bg="whiteAlpha.200"
              px={3}
              py={1}
              rounded="full"
              fontSize="xs"
              spacing={2}
            >
              <Icon as={isMobile ? PhoneIcon : ViewIcon} boxSize={3} />
              <Text>{isMobile ? 'Mobile Device' : 'Desktop Device'}</Text>
            </HStack>
          </VStack>

          {/* Progress bar */}
          {(status === 'qr-generated' || status === 'waiting') && (
            <Box position="absolute" bottom={0} left={0} right={0}>
              <Progress
                value={progressValue}
                size="sm"
                colorScheme="yellow"
                bg="whiteAlpha.200"
                hasStripe
                isAnimated
              />
            </Box>
          )}
        </Box>

        {/* Main content */}
        <Box p={6}>
          <VStack spacing={6}>
            {/* Payment details card */}
            <Box
              w="full"
              bg={useColorModeValue('gray.50', 'gray.600')}
              borderRadius="xl"
              p={5}
              border="1px solid"
              borderColor={borderColor}
            >
              <VStack spacing={4}>
                <HStack w="full" justify="space-between" align="center">
                  <Text color={textColor} fontWeight="500">Paying to</Text>
                  <Badge colorScheme="blue" variant="subtle" fontSize="sm" px={3} py={1}>
                    {Name}
                  </Badge>
                </HStack>
                
                <Divider />
                
                <HStack w="full" justify="space-between" align="center">
                  <Text color={textColor} fontWeight="500">Amount</Text>
                  <Text
                    fontWeight="700"
                    fontSize="xl"
                    color="green.500"
                    fontFamily="mono"
                  >
                    ₹{amount}
                  </Text>
                </HStack>
                
                <Divider />
                
                <HStack w="full" justify="space-between" align="center">
                  <Text color={textColor} fontWeight="500">UPI ID</Text>
                  <Badge
                    colorScheme="purple"
                    variant="outline"
                    fontFamily="mono"
                    fontSize="xs"
                    px={2}
                  >
                    {upiProvider}
                  </Badge>
                </HStack>
              </VStack>
            </Box>

            {/* QR Code section */}
            {status === 'qr-generated' && !isMobile && (
              <VStack spacing={4}>
                <Box
                  p={4}
                  bg="white"
                  borderRadius="2xl"
                  shadow="lg"
                  border="4px solid"
                  borderColor="gray.100"
                >
                  {qrCodeUrl ? (
                    <Image src={qrCodeUrl} alt="Payment QR Code" boxSize="220px" />
                  ) : (
                    <Skeleton boxSize="220px" borderRadius="lg" />
                  )}
                </Box>
                
                <VStack spacing={3}>
                  <Text fontSize="sm" color={textColor} fontWeight="600" textAlign="center">
                    Scan with any UPI app to pay
                  </Text>
                  
                  <HStack spacing={2} wrap="wrap" justify="center">
                    <Badge colorScheme="blue" variant="solid" fontSize="xs" px={2} py={1}>
                      <HStack spacing={1}>
                        <Icon as={PhoneIcon} boxSize={3} />
                        <Text>PhonePe</Text>
                      </HStack>
                    </Badge>
                    <Badge colorScheme="green" variant="solid" fontSize="xs" px={2} py={1}>
                      <HStack spacing={1}>
                        <Icon as={PhoneIcon} boxSize={3} />
                        <Text>Google Pay</Text>
                      </HStack>
                    </Badge>
                    <Badge colorScheme="purple" variant="solid" fontSize="xs" px={2} py={1}>
                      <HStack spacing={1}>
                        <Icon as={PhoneIcon} boxSize={3} />
                        <Text>Paytm</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                </VStack>
              </VStack>
            )}

            {/* Timer alert */}
            {(status === 'qr-generated' || status === 'waiting') && (
              <Alert
                status={countdown <= 60 ? 'warning' : 'info'}
                rounded="xl"
                variant="left-accent"
                bg={countdown <= 60 ? 'orange.50' : 'blue.50'}
                borderColor={countdown <= 60 ? 'orange.200' : 'blue.200'}
              >
                <AlertIcon />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight="600" fontSize="sm">
                    Time Remaining: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                  </Text>
                  {countdown <= 60 && (
                    <Text fontSize="xs" color="orange.600">
                      Payment session will expire soon
                    </Text>
                  )}
                </VStack>
              </Alert>
            )}

            {/* Payment confirmation dialog */}
            {showConfirmation && (
              <Box
                w="full"
                bg="yellow.50"
                borderRadius="xl"
                p={5}
                border="2px solid"
                borderColor="yellow.200"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="4px"
                  bgGradient="linear(to-r, yellow.400, orange.400)"
                />
                
                <VStack spacing={4}>
                  <Circle size="60px" bg="yellow.100" border="2px solid" borderColor="yellow.300">
                    <Icon as={InfoIcon} boxSize={6} color="yellow.600" />
                  </Circle>
                  
                  <VStack spacing={2}>
                    <Text fontWeight="700" color="yellow.800" fontSize="lg" textAlign="center">
                      Payment Confirmation
                    </Text>
                    <Text fontSize="sm" color="yellow.700" textAlign="center">
                      Have you successfully completed the payment?
                    </Text>
                  </VStack>
                  
                  <VStack w="full" spacing={3}>
                    <Button
                      onClick={handlePaymentCompleted}
                      colorScheme="green"
                      size="lg"
                      w="full"
                      leftIcon={<CheckCircleIcon />}
                      boxShadow="md"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    >
                      Yes, Payment Completed
                    </Button>
                    <Button
                      onClick={() => setShowConfirmation(false)}
                      variant="outline"
                      colorScheme="yellow"
                      w="full"
                      leftIcon={<TimeIcon />}
                    >
                      Still Processing Payment
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            )}

            {/* Action buttons */}
            {!showConfirmation && (
              <VStack w="full" spacing={3}>
                {isMobile ? (
                  <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    onClick={openUpiApp}
                    leftIcon={<PhoneIcon />}
                    boxShadow="md"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  >
                    Open UPI App
                  </Button>
                ) : (
                  <>
                    <Button
                      colorScheme="green"
                      size="lg"
                      w="full"
                      onClick={handlePaymentCompleted}
                      leftIcon={<CheckCircleIcon />}
                      boxShadow="md"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    >
                      Payment Completed
                    </Button>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="lg"
                      w="full"
                      onClick={copyLink}
                      leftIcon={<CopyIcon />}
                      _hover={{ transform: 'translateY(-2px)' }}
                    >
                      Copy UPI Link
                    </Button>
                  </>
                )}
                
                <Button
                  w="full"
                  variant="ghost"
                  onClick={onCancel}
                  leftIcon={<ArrowBackIcon />}
                  size="lg"
                  color={textColor}
                >
                  Cancel Payment
                </Button>
              </VStack>
            )}

            {/* Security note */}
            <HStack
              spacing={3}
              p={4}
              bg={useColorModeValue('green.50', 'green.900')}
              borderRadius="lg"
              w="full"
            >
              <Icon as={LockIcon} color="green.500" boxSize={5} />
              <Text fontSize="xs" color="green.600" fontWeight="500" textAlign="center" flex={1}>
                {isMobile
                  ? 'Secure payment powered by UPI. Make sure you have a UPI app installed.'
                  : 'Your payment is secured with bank-grade encryption. Scan the QR code with your mobile UPI app.'}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentProcessor;
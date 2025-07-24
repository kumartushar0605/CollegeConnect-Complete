import React, { useState } from 'react';
import {
  Box,
  Input,
  Select,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Flex,
  Icon,
  Spinner,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  Smartphone,
  DollarSign,
  Send,
  AlertCircle,
  Monitor
} from 'lucide-react';

const PaymentForm = ({ onPaymentInitiated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [upiProvider, setUpiProvider] = useState('@ybl');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validatePhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validateAmount = (amt) => {
    const amountNum = parseFloat(amt);
    return !isNaN(amountNum) && amountNum > 0 && amountNum <= 100000;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    if (errors.phone && value.length === 10 && validatePhoneNumber(value)) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
    if (errors.amount && validateAmount(value)) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!validateAmount(amount)) {
      newErrors.amount = 'Please enter a valid amount (₹1 - ₹100,000)';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onPaymentInitiated(phoneNumber, amount, upiProvider);
    setIsProcessing(false);
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="xl"
      p={{ base: 6, md: 8 }}
      w="full"
      maxW="md"
      mx="auto"
    >
      <Box textAlign="center" mb={8}>
        <Flex
          bgGradient="linear(to-r, blue.500, purple.600)"
          w="16"
          h="16"
          borderRadius="full"
          align="center"
          justify="center"
          mx="auto"
          mb={4}
        >
          <Icon as={Send} w={8} h={8} color="white" />
        </Flex>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
          Quick Pay
        </Text>
        <Text color="gray.600">Send money instantly via UPI</Text>
        <Flex justify="center" align="center" mt={3} fontSize="sm" color="gray.500">
          <Icon as={isMobile ? Smartphone : Monitor} w={4} h={4} mr={1} />
          {isMobile ? 'Mobile Device Detected' : 'Desktop/Laptop Detected'}
        </Flex>
      </Box>

      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <FormControl isInvalid={!!errors.phone}>
            <FormLabel>Recipient Phone Number</FormLabel>
            <Flex position="relative" align="center">
              <Icon as={Smartphone} position="absolute" left={3} color="gray.400" w={5} h={5} />
              <Input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit phone number"
                pl={12}
                pr={4}
                py={3}
                borderRadius="lg"
              />
            </Flex>
            {errors.phone && (
              <FormErrorMessage>
                <Flex align="center">
                  <Icon as={AlertCircle} w={4} h={4} mr={1} />
                  {errors.phone}
                </Flex>
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.amount}>
            <FormLabel>Amount (₹)</FormLabel>
            <Flex position="relative" align="center">
              <Icon as={DollarSign} position="absolute" left={3} color="gray.400" w={5} h={5} />
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount to pay"
                pl={12}
                pr={4}
                py={3}
                borderRadius="lg"
              />
            </Flex>
            {errors.amount && (
              <FormErrorMessage>
                <Flex align="center">
                  <Icon as={AlertCircle} w={4} h={4} mr={1} />
                  {errors.amount}
                </Flex>
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>UPI Provider</FormLabel>
            <Select
              value={upiProvider}
              onChange={(e) => setUpiProvider(e.target.value)}
              py={3}
              borderRadius="lg"
            >
              <option value="@ybl">PhonePe (@ybl)</option>
              <option value="@paytm">Paytm (@paytm)</option>
              <option value="@okaxis">Google Pay (@okaxis)</option>
              <option value="@ibl">IDFC Bank (@ibl)</option>
              <option value="@axl">Axis Bank (@axl)</option>
              <option value="@hdfcbank">HDFC Bank (@hdfcbank)</option>
              <option value="@icici">ICICI Bank (@icici)</option>
            </Select>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Select the UPI provider of the recipient's phone number
            </Text>
          </FormControl>

          <Button
            type="submit"
            isDisabled={isProcessing}
            w="full"
            py={3}
            fontWeight="semibold"
            color="white"
            bgGradient="linear(to-r, blue.500, purple.600)"
            _hover={{ bgGradient: 'linear(to-r, blue.600, purple.700)', transform: 'scale(1.02)' }}
            _disabled={{ bg: 'gray.400', cursor: 'not-allowed' }}
            transition="all 0.2s"
          >
            {isProcessing ? (
              <Flex align="center" justify="center">
                <Spinner size="sm" color="white" mr={2} />
                Processing...
              </Flex>
            ) : (
              'Pay Now'
            )}
          </Button>
        </Stack>
      </form>

      <Box mt={6} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          {isMobile
            ? 'Will open your UPI app directly'
            : 'QR code will be generated for mobile scanning'}
        </Text>
        <Text fontSize="xs" color="gray.400" mt={1}>
          Secure payment powered by UPI
        </Text>
      </Box>
    </Box>
  );
};

export default PaymentForm;

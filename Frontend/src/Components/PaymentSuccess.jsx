import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useClipboard,
  useToast,
  VStack,
  HStack,
  Badge,
  Input,
  FormControl,
  FormLabel,
  Spinner,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  DownloadIcon,
  ExternalLinkIcon,
  PhoneIcon,
  InfoIcon,
  AttachmentIcon,
} from '@chakra-ui/icons';
import html2canvas from 'html2canvas';
import axios from 'axios';

const PaymentSuccess = ({ Email, amount, upiProvider, transactionId, teacherId }) => {
  const receiptRef = useRef();
  const toast = useToast();
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent);
  const fileInputRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('screenshot'); // 'screenshot' or 'file'

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const receiptText = `Payment Successful!\n\nTo: ${Email}\nAmount: ₹${amount}\nTransaction ID: ${transactionId}\nDate: ${new Date().toLocaleString()}\n\nPaid via QuickPay UPI`;

  const { onCopy } = useClipboard(receiptText);

  const shareReceipt = async () => {
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: 'Payment Receipt',
          text: receiptText,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      onCopy();
      toast({
        title: 'Receipt copied to clipboard.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Function to capture screenshot and upload
  const uploadReceiptScreenshot = async () => {
    if (!teacherId) {
      toast({
        title: 'Teacher ID is required.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    
    try {
      // Capture the receipt as image
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        const fileName = `receipt_${transactionId}_${Date.now()}.png`;
        formData.append('image', blob, fileName);

        try {
          const response = await axios.post(
            `https://collegeconnect-backend.onrender.com/upload-image/${teacherId}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          toast({
            title: 'Receipt uploaded successfully!',
            description: 'Receipt has been saved and linked to teacher.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          console.log('Upload response:', response.data);
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: 'Upload failed',
            description: error.response?.data?.error || 'Failed to upload receipt',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Screenshot error:', error);
      toast({
        title: 'Screenshot failed',
        description: 'Could not capture receipt image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  // Function to upload selected file
  const uploadSelectedFile = async () => {
    if (!selectedFile) {
      toast({
        title: 'Please select a file first.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!teacherId) {
      toast({
        title: 'Teacher ID is required.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(
        `https://collegeconnect-backend.onrender.com/upload-image/${teacherId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast({
        title: 'File uploaded successfully!',
        description: 'Receipt has been saved and linked to teacher.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      console.log('Upload response:', response.data);
      setSelectedFile(null);
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'Failed to upload file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

 

  return (
    <Box bg="gray.400" rounded="2xl" shadow="xl" p={{ base: 6, md: 8 }} maxW="md" mx="auto">
      <Stack spacing={6} textAlign="center">
        <Box>
          <Flex
            bg="green.100"
            w="20"
            h="20"
            rounded="full"
            align="center"
            justify="center"
            mx="auto"
            mb={4}
          >
            <Icon as={CheckCircleIcon} w={12} h={12} color="green.500" />
          </Flex>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Payment Successful!
          </Text>
          <Text color="gray.600">Your payment has been processed successfully</Text>
          <Flex justify="center" align="center" mt={2} fontSize="sm" color="gray.500">
            <Icon as={isMobile ? PhoneIcon : InfoIcon} mr={1} />
            {isMobile ? 'Completed on Mobile' : 'Completed on Desktop'}
          </Flex>
        </Box>

        {/* Receipt Content to Screenshot */}
        <Box
          ref={receiptRef}
          bgGradient="linear(to-r, green.50, blue.200)"
          p={6}
          rounded="lg"
          border="1px"
          borderColor="green.200"
        >
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between">
              <Text color="gray.600" fontWeight="medium">Recipient</Text>
              <Text fontWeight="semibold">{upiProvider}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.600" fontWeight="medium">Amount Paid</Text>
              <Text fontWeight="bold" color="green.600" fontSize="lg">₹{amount}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.600" fontWeight="medium">Transaction ID</Text>
              <Text fontFamily="mono" textColor={'black'} fontSize="sm" bg="gray.100" px={2} py={1} rounded="md">
                {transactionId}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.600" fontWeight="medium">Date & Time</Text>
              <Text fontSize="sm">{new Date().toLocaleString()}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.600" fontWeight="medium">Status</Text>
              <Badge colorScheme="green.500" rounded="full" px={3} py={1}>
               <Text color={'black'}> Completed</Text>
              </Badge>
            </Flex>
          </VStack>
        </Box>

        {/* Action Buttons */}
        <Stack spacing={3}>
          <HStack spacing={3}>
            <Button
              onClick={() => window.print()}
              variant="outline"
              leftIcon={<DownloadIcon />}
              w="full"
            >
              Print
            </Button>
            <Button
              onClick={shareReceipt}
              variant="outline"
              leftIcon={<ExternalLinkIcon />}
              w="full"
            >
              Share
            </Button>
          </HStack>

         
          {/* Upload Methods */}
          <Stack spacing={3} mt={4}>
            
            {/* Auto Upload (Screenshot) */}
            

            {/* Manual File Upload */}
            <FormControl>
              <FormLabel fontSize="sm" color="gray.900">
                Or upload a custom file:
              </FormLabel>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                size="sm"
                mb={2}
              />
              <Button
                onClick={uploadSelectedFile}
                variant="outline"
                colorScheme="teal.400"
                w="full"
                size="sm"
                isDisabled={!selectedFile}
                isLoading={uploading && uploadMethod === 'file'}
                loadingText="Uploading..."
                leftIcon={<AttachmentIcon />}
              >
                Upload Selected File
              </Button>
            </FormControl>
          </Stack>
        </Stack>

        <Box textAlign="center" mt={4}>
          <Text fontSize="sm" color="gray.900">
            Thank you for using QuickPay UPI
          </Text>
          <Text fontSize="xs" color="gray.800" mt={1}>
            Keep this receipt for your records
          </Text>
          {teacherId && (
            <Text fontSize="xs" color="gray.600" mt={1}>
              Teacher ID: {teacherId}
            </Text>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default PaymentSuccess;
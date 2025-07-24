import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Spinner,
  Input,
  useToast,
  VStack,
  Text,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';

// Actual API function
const fetchTeacherData = async () => {
  const teacherResponse = await axios.get('https://collegeconnect-backend.onrender.com/Tme', { 
    withCredentials: true 
  });
  return teacherResponse.data;
};

const PaymentStatus = () => {
  const location = useLocation();
  const [sec, setSec] = useState('');
    const [student, setStudent] = useState(null);
  
  const navigate = useNavigate();
  const [status, setStatus] = useState('NO');
  const [loading, setLoading] = useState(true);
  const [teacherImage, setTeacherImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch teacher image when component mounts
  
    useEffect(() => {
      const loadStudentData = async () => {
        try {
          setLoading(true);
          const studentResponse = await fetchTeacherData();
          const student = studentResponse.user;
          setStudent(student);
        } catch (err) {
          console.log(err);
        }
      };
  
      loadStudentData();
    }, []);

    const b= true;

  useEffect(() => {
    const fetchTeacherImage = async () => {
      try {
        
        setImageLoading(true);
        const response = await fetch(`https://collegeconnect-backend.onrender.com/get-image/${student?.email}`);
        const data = await response.json();
        
        if (response.ok && data.fileUrl) {
          setTeacherImage(data.fileUrl);
          setShowVerificationPopup(true);
         
          
          
            onOpen();
          
          // Open the modal
        } else {
          startPolling();
        }
      } catch (error) {
        console.error('Error fetching teacher image:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch teacher image.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        // If error, start polling directly
        startPolling();
      } finally {
        setImageLoading(false);
      }
    };

    if (student?.email) {
      fetchTeacherImage();
    }
    const interval = setInterval(fetchTeacherImage, 10000); // Poll every 3 seconds

    return () => clearInterval(interval); //
  }, [student?.email]);

  // Function to start polling for payment status
  const startPolling = () => {
    const fetchStatus = async () => {
      if(status==="NO"){
         try {
        const response = await fetch(`https://collegeconnect-backend.onrender.com/address/${student?.email}`);
        const data = await response.json();
        console.log(data);

        if (data.payment === 'YES') {
          setLoading(false);
          setStatus('YES');
        } else {
          setStatus('NO');
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      }
      }
    };

    const interval = setInterval(fetchStatus, 8000); // Poll every 3 seconds

    return () => clearInterval(interval); // Cleanup function
  };

  // Handle verification button click
  const handleVerification = async () => {
    try {
      // First API call to verify payment
      const paymentResponse = await fetch(`https://collegeconnect-backend.onrender.com/pay/${student?.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (paymentResponse.ok) {
        toast({
          title: 'Verification Successful',
          description: 'Payment verification initiated. Please wait...',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Close the modal
        onClose();
        setShowVerificationPopup(false);

        // Start polling for payment status
        const cleanup = startPolling();

        // Store cleanup function for later use
        return cleanup;
      } else {
        toast({
          title: 'Verification Failed',
          description: 'Failed to verify payment. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast({
        title: 'Error',
        description: 'An error occurred during verification.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle modal close without verification
  const handleModalClose = () => {
    onClose();
    setShowVerificationPopup(false);
    // Start polling even without verification
    startPolling();
  };

  // Show success toast when payment is confirmed
  useEffect(() => {
    if (status === 'YES') {
      toast({
        title: 'Payment Successful!',
        description: "Please enter the secret code to proceed.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      const deleteTeacherImage = async () => {
        try {
          const response = await fetch(`https://collegeconnect-backend.onrender.com/delete-image/${student?.email}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            console.log('Teacher image deleted successfully');
            setTeacherImage(''); // Clear the image from state
          } else {
            console.error('Failed to delete teacher image');
          }
        } catch (error) {
          console.error('Error deleting teacher image:', error);
        }
      };

      deleteTeacherImage();

    }
  }, [status, toast]);

  // Handle secret code submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://collegeconnect-backend.onrender.com/sec/${student?.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretCode: sec }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Secret code submitted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate("/meet", { state: { sec } });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to submit the secret code.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgGradient="linear(to-r, teal.500, blue.500)"
      >
        <VStack
          spacing={6}
          p={8}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          maxW="400px"
          w="full"
          textAlign="center"
        >
          <Heading size="lg" color="teal.600">
            Payment Status
          </Heading>

          {imageLoading && (
            <Alert status="info">
              <AlertIcon />
              Loading teacher information...
            </Alert>
          )}

          {loading ? (
            <VStack spacing={4}>
              <Spinner
                size="xl"
                speed="0.8s"
                thickness="4px"
                color="teal.500"
                emptyColor="gray.200"
              />
              <Text fontSize="md" color="gray.600">
                Waiting for the payment to be done. Please wait...
              </Text>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Text fontSize="lg" color="green.500">
                Payment received! Enter any room code
              </Text>
              <Input
                placeholder="Enter your secret code"
                size="md"
                focusBorderColor="teal.500"
                onChange={(e) => setSec(e.target.value)}
                color={'black'}
                borderColor={'teal'}
                value={sec}
                _hover={{ borderColor: 'teal.400' }}
              />
              <Button
                colorScheme="teal"
                variant="solid"
                size="md"
                w="full"
                onClick={handleSubmit}
                mt={4}
              >
                Submit
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>

      {/* Teacher Verification Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Verification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="md" textAlign="center">
                Please verify that you payment is done:
              </Text>
              {teacherImage ? (
                <Image
                  src={teacherImage}
                  alt="Teacher"
                  maxH="300px"
                  maxW="100%"
                  objectFit="contain"
                  borderRadius="md"
                  border="2px solid"
                  borderColor="gray.200"
                />
              ) : (
                <Box
                  w="200px"
                  h="200px"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                >
                  <Text color="gray.500">No image available</Text>
                </Box>
              )}
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Click "Verified" if you payment is done, or "Cancel" to proceed without verification.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleModalClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleVerification}>
              Verified
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentStatus;
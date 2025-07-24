import React, { useContext, useState,useEffect } from 'react';
import { 
  ChakraProvider, 
  Box, 
  Image, 
  Button, 
  keyframes,
  VStack, 
  HStack,
  Text, 
  useToast, 
  Textarea,
  Container,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Badge,
  Icon,
  Flex,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress,
  Spinner
} from '@chakra-ui/react';
import img from '../Assests/CC.png';
import { Context } from '..';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom icons
const GlobalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const QuestionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);
const fetchStudentData = async () => {
  const studentResponse = await axios.get('https://collegeconnect-backend.onrender.com/Sme', { 
    withCredentials: true 
  });
  return studentResponse.data;
};

function GlobalS() {
  const [doubt, setDoubt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { studentt } = useContext(Context);
    const [student, setStudent] = useState(null);
  
  const navigate = useNavigate();

  // Theme colors
  const bgGradient = useColorModeValue(
    'linear(135deg, teal.50 0%, blue.50 50%, purple.50 100%)',
    'linear(135deg, gray.900 0%, teal.900 50%, purple.900 100%)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  // Animations
  const colorChange = keyframes`
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  `;

  const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  `;

  const handleInputChange = (e) => {
    setDoubt(e.target.value);
  };
  // Actual API function


   useEffect(() => {
      const loadStudentData = async () => {
        try {
          const studentResponse = await fetchStudentData();
          const student = studentResponse.user;
          setStudent(student);
        } catch (err) {
          toast({
            title: "Error loading profile",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } 
      };
  
      loadStudentData();
    }, [toast]);

  const handleSubmit = async () => {
    if (!doubt.trim()) {
      toast({
        title: "Input is empty.",
        description: "Please enter your doubt before submitting.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://collegeconnect-backend.onrender.com/doubts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doubt,
          sem: student.semester,
          name: student.name,
          email: student.email,
          chapter: "",
          subject: "",
          global: "YES"
        }),
      });

      if (response.ok) {
        toast({
          title: "Doubt Submitted Successfully! 🌍",
          description: "Your global doubt has been posted to the community.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setDoubt('');
        navigate("/accept", { state: { email: studentt.email } });
      } else {
        toast({
          title: "Submission Failed.",
          description: "There was an error submitting your doubt. Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Network Error.",
        description: "Unable to connect to the backend. Please try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  };

  const resetForm = () => {
    setDoubt('');
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bgGradient={bgGradient}>
        <Container maxW="4xl" py={10}>
          <VStack spacing={8} align="stretch">
            {/* Header Section */}
            <Card bg={cardBg} borderRadius="2xl" boxShadow="2xl" overflow="hidden">
              <Box
                bgGradient="linear(135deg, teal.400, blue.500, purple.500)"
                p={1}
              >
                <CardBody bg={cardBg} borderRadius="xl" m={1}>
                  <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                    <VStack align="start" spacing={2}>
                      <HStack spacing={2}>
                        <Icon as={GlobalIcon} color="teal.500" boxSize={6} />
                        <Badge colorScheme="teal" borderRadius="full" px={3} py={1}>
                          Global Questions
                        </Badge>
                      </HStack>
                      
                      <Heading 
                        size="xl" 
                        color={headingColor}
                        bgGradient="linear(135deg, teal.600, blue.600, purple.600)"
                        bgClip="text"
                      >
                        Ask Your Doubts Globally
                      </Heading>
                      
                      <Text color={textColor} fontSize="lg">
                        Share your questions with the entire community
                      </Text>
                    </VStack>

                    <VStack align="end" spacing={2}>
                      <HStack>
                        <Avatar size="md" name={student?.name || 'Student'}>
                          <AvatarBadge boxSize="1.25em" bg="green.500" />
                        </Avatar>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" color={headingColor}>
                            {student?.name || 'Student'}
                          </Text>
                          <Text fontSize="sm" color={textColor}>
                            {student?.email || 'student@email.com'}
                          </Text>
                        </VStack>
                      </HStack>
                      
                      <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                        Semester {student?.semester || 'N/A'}
                      </Badge>
                    </VStack>
                  </Flex>
                </CardBody>
              </Box>
            </Card>

            {/* Main Content */}
            <Card bg={cardBg} borderRadius="xl" boxShadow="xl">
              <CardBody p={8}>
                <VStack spacing={8} align="stretch">
                  {/* Animated Logo Section */}
                  <Flex justify="center" mb={4}>
                    <Box position="relative">
                      <Image
                        boxSize="180px"
                        src={img}
                        alt="Community Connect"
                        borderRadius="full"
                        objectFit="cover"
                        animation={`${colorChange} 8s infinite linear, ${float} 3s ease-in-out infinite`}
                        boxShadow="0px 15px 35px rgba(0, 0, 0, 0.2)"
                        border="4px solid"
                        borderColor="transparent"
                        bgGradient="linear(45deg, teal.400, blue.500, purple.500)"
                        p={1}
                      />
                      <Box
                        position="absolute"
                        top="-10px"
                        right="-10px"
                        bg="green.500"
                        borderRadius="full"
                        p={2}
                        boxShadow="lg"
                        animation={`${float} 2s ease-in-out infinite`}
                      >
                        <Icon as={GlobalIcon} color="white" boxSize={4} />
                      </Box>
                    </Box>
                  </Flex>

                  {/* Info Alert */}
                  <Alert status="info" borderRadius="lg" bg="blue.50" border="1px solid" borderColor="blue.200">
                    <AlertIcon color="blue.500" />
                    <AlertDescription color="blue.700" fontWeight="medium">
                      Global doubts are visible to all students across different semesters and subjects. 
                      Get diverse perspectives from the entire community!
                    </AlertDescription>
                  </Alert>

                  {/* Form Section */}
                  <Card variant="outline" borderRadius="xl" borderWidth={2} borderColor="teal.200">
                    <CardHeader>
                      <HStack spacing={3}>
                        <Icon as={QuestionIcon} color="teal.500" boxSize={6} />
                        <Heading size="md" color={headingColor}>
                          Share Your Question
                        </Heading>
                      </HStack>
                    </CardHeader>
                    
                    <Divider />
                    
                    <CardBody>
                      <VStack spacing={6}>
                        <FormControl>
                          <FormLabel 
                            color={headingColor} 
                            fontWeight="semibold"
                            fontSize="lg"
                          >
                            What would you like to ask the community?
                          </FormLabel>
                          <Textarea
                            placeholder="Describe your question in detail. Since this is global, provide context about your topic, semester, or subject if relevant..."
                            value={doubt}
                            onChange={handleInputChange}
                            rows={6}
                            maxLength={1000}
                            resize="vertical"
                            focusBorderColor="teal.400"
                            borderWidth={2}
                            borderColor="gray.200"
                            _hover={{
                              borderColor: "teal.300",
                            }}
                            _focus={{
                              borderColor: "teal.400",
                              boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)',
                            }}
                            fontSize="md"
                          />
                          <HStack justify="space-between" mt={2}>
                            <Text fontSize="sm" color={textColor}>
                              {doubt.length}/1000 characters
                            </Text>
                            <Progress 
                              value={(doubt.length / 1000) * 100} 
                              size="sm" 
                              width="100px"
                              colorScheme="teal"
                              borderRadius="full"
                            />
                          </HStack>
                        </FormControl>

                        {/* Action Buttons */}
                        <HStack w="100%" spacing={4}>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={resetForm}
                            flex={1}
                            borderWidth={2}
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'lg',
                            }}
                            transition="all 0.2s"
                          >
                            Clear
                          </Button>
                          
                          <Button
                            size="lg"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            loadingText="Posting to Community..."
                            rightIcon={isSubmitting ? <Spinner size="sm" /> : <SendIcon />}
                            flex={2}
                            isDisabled={!doubt.trim() || isSubmitting}
                            bgGradient="linear(135deg, teal.400, blue.500, purple.500)"
                            color="white"
                            _hover={{
                              bgGradient: "linear(135deg, teal.500, blue.600, purple.600)",
                              transform: 'translateY(-2px)',
                              boxShadow: 'xl',
                            }}
                            _active={{
                              transform: 'translateY(0px)',
                            }}
                            transition="all 0.2s"
                            fontWeight="bold"
                            fontSize="md"
                          >
                            Ask Community
                          </Button>
                        </HStack>

                        {/* Quick Tips */}
                        <Card variant="subtle" bg="gray.50" borderRadius="lg">
                          <CardBody py={4}>
                            <VStack align="start" spacing={2}>
                              <Text fontWeight="semibold" color="gray.700" fontSize="sm">
                                💡 Tips for better responses:
                              </Text>
                              <VStack align="start" spacing={1} pl={4}>
                                <Text fontSize="sm" color="gray.600">
                                  • Be specific about your problem or concept
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  • Mention your semester/subject if relevant
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  • Include what you've already tried
                                </Text>
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default GlobalS;
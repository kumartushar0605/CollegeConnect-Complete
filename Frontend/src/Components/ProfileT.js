import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Grid,
  GridItem,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon,
  Flex,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Button,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  SimpleGrid,
  IconButton,
  Tooltip,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Select
} from '@chakra-ui/react';
import { 
  EmailIcon, 
  InfoIcon, 
  EditIcon, 
  AddIcon,
  StarIcon
} from '@chakra-ui/icons';
import axios from 'axios';


// Actual API function
const fetchTeacherData = async () => {
  const teacherResponse = await axios.get('https://collegeconnect-backend.onrender.com/Tme', { 
    withCredentials: true 
  });
  return teacherResponse.data;
};

const TeacherProfile  = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        const studentResponse = await fetchTeacherData();
        const student = studentResponse.user;
        setStudent(student);
        setEditedStudent(student);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error loading profile",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [toast]);

  const handleSaveProfile = async () => {
    try {
      await axios.put(`https://collegeconnect-backend.onrender.com/editT/${student.email}`, editedStudent, { 
        withCredentials: true 
      });
      setStudent(editedStudent);
      onClose();
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error updating profile",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditedStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Container maxW="container.xl" centerContent py={20}>
        <VStack spacing={6}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="lg" color={mutedColor}>Loading student profile...</Text>
          <Progress w="300px" size="sm" isIndeterminate colorScheme="blue" />
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={20}>
        <Alert status="error" borderRadius="lg" variant="subtle">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="lg">Error Loading Profile!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container maxW="container.xl" py={20}>
        <Alert status="info" borderRadius="lg" variant="subtle">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="lg">No Profile Data</AlertTitle>
            <AlertDescription>No student data found. Please contact support.</AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Card bg={cardBg} shadow="2xl" borderRadius="2xl" overflow="hidden">
           
            <CardBody mt="-10px">
              <Flex direction={{ base: 'column', lg: 'row' }} align="center" gap={8}>
                <Avatar
                  size="2xl"
                  name={student.name}
                  bg="blue.500"
                  color="white"
                  fontWeight="bold"
                  border="6px solid"
                  borderColor={cardBg}
                  shadow="xl"
                />
                <VStack align={{ base: 'center', lg: 'flex-start' }} spacing={3} flex={1}>
                  <Heading size="2xl" color={textColor} textAlign={{ base: 'center', lg: 'left' }}>
                    {student.name}
                  </Heading>
                  <HStack spacing={4} flexWrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
                    <HStack>
                      <Icon as={EmailIcon} color="blue.500" />
                      <Text fontSize="lg" color={mutedColor}>{student.email}</Text>
                    </HStack>
                  </HStack>
                  <HStack spacing={3}>
                    <Badge colorScheme="blue" fontSize="md" px={4} py={2} borderRadius="full">
                      Teacher
                    </Badge>
                    {student.semester && (
                      <Badge colorScheme="green" fontSize="md" px={4} py={2} borderRadius="full">
                        Semester {student.semester}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Stats Section */}
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel color={mutedColor}>Skills</StatLabel>
                  <StatNumber color="blue.500" fontSize="3xl">
                    {student.skills ? student.skills.length : 0}
                  </StatNumber>
                  <StatHelpText color={mutedColor}>Listed</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel color={mutedColor}>Semester</StatLabel>
                  <StatNumber color="green.500" fontSize="3xl">
                    {student.semester || 'N/A'}
                  </StatNumber>
                  <StatHelpText color={mutedColor}>Current</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            
            
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel color={mutedColor}>Section</StatLabel>
                  <StatNumber color="purple.500" fontSize="3xl">
                    {student.section || 'N/A'}
                  </StatNumber>
                  <StatHelpText color={mutedColor}>Current</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Grid */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            <VStack spacing={6} align="stretch">
              {/* Academic Information */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardHeader>
                  <HStack>
                    <Icon as={InfoIcon} color="blue.500" boxSize={6} />
                    <Heading size="lg" color={textColor}>Academic Information</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
                    <Box>
                      <Text fontSize="sm" color={mutedColor} mb={2} fontWeight="semibold">
                        College Name
                      </Text>
                      <Text fontSize="lg" color={textColor} fontWeight="medium">
                        {student.collegeName || 'Not specified'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color={mutedColor} mb={2} fontWeight="semibold">
                        Section
                      </Text>
                      <Text fontSize="lg" color={textColor} fontWeight="medium">
                        {student.section || 'Not specified'}
                      </Text>
                    </Box>
                    {student.address && (
                      <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
                        <Text fontSize="sm" color={mutedColor} mb={2} fontWeight="semibold">
                          Address
                        </Text>
                        <Text fontSize="lg" color={textColor} fontWeight="medium">
                          {student.address}
                        </Text>
                      </Box>
                    )}
                  </Grid>
                </CardBody>
              </Card>

              {/* Skills Section */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardHeader>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={StarIcon} color="blue.500" boxSize={6} />
                      <Heading size="lg" color={textColor}>Skills & Expertise</Heading>
                    </HStack>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      leftIcon={<AddIcon />}
                      onClick={onOpen}
                    >
                      Add Skill
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody>
                  {student.skills && student.skills.length > 0 ? (
                    <Wrap spacing={3}>
                      {student.skills.map((skill, index) => (
                        <WrapItem key={index}>
                          <Tag
                            size="lg"
                            colorScheme="blue"
                            borderRadius="full"
                            variant="subtle"
                            px={4}
                            py={2}
                            fontWeight="medium"
                          >
                            <TagLabel>{skill}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  ) : (
                    <VStack spacing={4} py={8}>
                      <Text color={mutedColor} fontSize="lg" textAlign="center">
                        No skills added yet
                      </Text>
                      <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={onOpen}>
                        Add Your First Skill
                      </Button>
                    </VStack>
                  )}
                </CardBody>
              </Card>
            </VStack>

            {/* Sidebar */}
            <VStack spacing={6} align="stretch">
              {/* Quick Actions */}
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardHeader>
                  <Heading size="md" color={textColor}>Quick Actions</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3}>
                    <Button
                      w="full"
                      colorScheme="blue"
                      leftIcon={<EditIcon />}
                      onClick={onOpen}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      w="full"
                      variant="outline"
                      leftIcon={<AddIcon />}
                      onClick={onOpen}
                    >
                      Add Skills
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </Grid>
        </VStack>
        {/* Stats Section */}
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} mt={10}>

              
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel color={mutedColor}>Teaching Fees</StatLabel>
                  <StatNumber color="purple.500" fontSize="3xl">
                    {student.price || 'N/A'}
                  </StatNumber>
                  <StatHelpText color={mutedColor}>Current</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody textAlign="center">
                <Stat>
                  <StatLabel color={mutedColor}>Your UPI ID</StatLabel>
                  <StatNumber color="purple.500" fontSize="3xl">
                    {student.account || 'N/A'}
                  </StatNumber>
                  <StatHelpText color={mutedColor}>Current</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

        {/* Edit Profile Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={editedStudent.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={editedStudent.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>College Name</FormLabel>
                  <Input
                    value={editedStudent.collegeName || ''}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                  />
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <FormControl>
                    <FormLabel>Semester</FormLabel>
                    <Select
                      value={editedStudent.semester || ''}
                      onChange={(e) => handleInputChange('semester', parseInt(e.target.value))}
                    >
                      <option value="">Select Semester</option>
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Section</FormLabel>
                    <Input
                      value={editedStudent.section || ''}
                      onChange={(e) => handleInputChange('section', e.target.value)}
                    />
                  </FormControl>
                   <FormControl>
                    <FormLabel>Teaching Fees</FormLabel>
                    <Input
                      value={editedStudent.price || ''}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>UPI ID</FormLabel>
                    <Input
                      value={editedStudent.account || ''}
                      onChange={(e) => handleInputChange('account', e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Skills (comma separated)</FormLabel>
                  <Textarea
                    value={editedStudent.skills ? editedStudent.skills.join(', ') : ''}
                    onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill))}
                    rows={3}
                    placeholder="JavaScript, React, Node.js, Python..."
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default TeacherProfile;
import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Button, Center, Text, IconButton, VStack,
  useDisclosure, Spinner, Image, HStack, Heading,
  Badge, Divider, Stack, Grid
} from '@chakra-ui/react';
import axios from 'axios';
import { FaComment, FaRedo } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import img from "../Assests/avatar-2092113.svg";
import { Context } from '../index';
import Chatwindow from './Chatwindow';

const TechHome = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const { sem } = location.state || {};
  const { teacherr } = useContext(Context);

  const [status, setStatus] = useState('Offline');
  const [students, setStudents] = useState([]);
  const [my, setMy] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };

  const get = async () => {
    const emaill = teacherr.email;
    try {
      const response = await axios.get(`https://collegeconnect-backend.onrender.com/get/${emaill}`);
      setMy(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const emaill = teacherr.email;
      const semester = teacherr.semester;
      const response = await axios.get('https://collegeconnect-backend.onrender.com/doubtss');

      const filteredStudents = response.data.filter(
        (student) =>
          student.semester <= semester && student.Temail === emaill && student.global === "NO"
      );
      const emptyTemailStudents = response.data.filter(
        (student) =>
          student.Temail === '' && student.semester <= semester && student.global === "NO"
      );

      const finalStudents = [...filteredStudents, ...emptyTemailStudents];
      setStudents(finalStudents);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get();
    if (status === 'Online') {
      fetchStudents();
      const interval = setInterval(fetchStudents, 10000);
      return () => clearInterval(interval);
    }
  }, [status, sem]);

  const handleToggleStatus = () => {
    if (status === 'Offline') {
      setStatus('Online');
    } else {
      setStatus('Offline');
      setStudents([]);
    }
  };

  const handleStudentSelection = async (Semail, doubt, _id) => {
    const { name, email, semester, price } = my;
    try {
      await fetch('https://collegeconnect-backend.onrender.com/sendd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, semester, Semail, price, doubt, _id }),
      });
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  const continuee = () => {
    const emaill = teacherr.email;
    navigate("/payStatus", { state: { emaill } });
  };

  return (
    <Center minH="100vh" bg="teal.900" py={8} px={4}>
      <VStack spacing={8} w="full" maxW="900px">
        {/* Header Section */}
        <Box w="full" bg="teal.800" borderRadius="lg" p={6} boxShadow="lg">
          <HStack justifyContent="space-between" mb={4}>
            <Heading size="lg" color="white">
              TechHome Dashboard
            </Heading>
            <IconButton
              aria-label="Refresh Page"
              icon={<FaRedo />}
              onClick={refreshPage}
              colorScheme="whiteAlpha"
              variant="ghost"
              _hover={{ color: 'teal.300' }}
            />
          </HStack>
          <Text fontSize="md" color="gray.300">
            Welcome! Here you can assist students by answering their doubts in real-time.
          </Text>
          <Divider borderColor="teal.600" my={4} />
          <Button
            onClick={handleToggleStatus}
            size="md"
            colorScheme={status === 'Offline' ? 'red' : 'green'}
            w={['full', 'auto']}
          >
            {status === 'Offline' ? 'Go Online' : 'Go Offline'}
          </Button>
        </Box>

        {/* Student Doubts Section */}
        {status === 'Online' && (
          <Box w="full" bg="teal.800" borderRadius="lg" p={6} boxShadow="lg">
            <Heading size="md" color="teal.100" mb={4}>
              Students with Doubts
            </Heading>

            {loading ? (
              <Center py={8}><Spinner size="lg" color="white" /></Center>
            ) : students.length > 0 ? (
              <VStack spacing={6} align="stretch">
                {students.map((student) => (
                  <Box
                    key={student._id}
                    p={5}
                    bg="teal.700"
                    rounded="md"
                    border="1px solid"
                    borderColor="teal.600"
                    boxShadow="md"
                    _hover={{ bg: "teal.600" }}
                  >
                    <Stack spacing={3}>
                      <HStack alignItems="flex-start">
                        <Image
                          src={img}
                          boxSize="60px"
                          borderRadius="full"
                          alt="Student Avatar"
                        />
                        <Box>
                          <Text fontWeight="bold" fontSize="lg" color="white">
                            {student.name}
                          </Text>
                          <Text color="gray.300">
                            Semester: {student.semester} | {student.subject}, Chapter: {student.chapter}
                          </Text>
                          <Text color="blue.200" mt={2}>
                            {student.doubt}
                          </Text>
                        </Box>
                      </HStack>

                      {/* Action Buttons */}
                      <Stack direction={['column', 'row']} spacing={3} pt={2}>
                        {student.reesponse === 'pending' ? (
                          <Badge colorScheme="yellow" w={['full', 'auto']} px={3} py={1}>
                            Awaiting Response
                          </Badge>
                        ) : student.reesponse === 'accepted' ? (
                          <Button
                            size="sm"
                            w={['full', 'auto']}
                            colorScheme="green"
                            onClick={continuee}
                          >
                            Ready for Session
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            w={['full', 'auto']}
                            colorScheme="purple"
                            onClick={() =>
                              handleStudentSelection(student.email, student.doubt, student._id)
                            }
                          >
                            Continue
                          </Button>
                        )}

                        <Button
                          size="sm"
                          w={['full', 'auto']}
                          leftIcon={<FaComment />}
                          colorScheme="blue"
                          variant="outline"
                          onClick={onOpen}
                        >
                          Chat
                        </Button>

                        {isOpen && (
                          <Chatwindow name={student.name} onClose={onClose} />
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text color="gray.300" mt={4}>
                No students have raised doubts yet. Please check again shortly.
              </Text>
            )}
          </Box>
        )}
      </VStack>
    </Center>
  );
};

export default TechHome;

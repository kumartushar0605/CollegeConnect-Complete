import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Button, Center, Text, VStack,
  useDisclosure, Spinner, Image, HStack,
  IconButton, Heading, Badge, Stack, Divider
} from '@chakra-ui/react';
import { FaRedo, FaComment } from 'react-icons/fa';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import img from "../Assests/avatar-2092113.svg";
import { Context } from '../index';
import Chatwindow from './Chatwindow';

// API Call
const fetchTeacherData = async () => {
  const teacherResponse = await axios.get('https://collegeconnect-backend.onrender.com/Tme', {
    withCredentials: true
  });
  return teacherResponse.data;
};

const GlobalT = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const { sem } = location.state || {};
  const [status, setStatus] = useState('Offline');
  const [students, setStudents] = useState([]);
  const [my, setMy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);

  // Get current teacher info on mount
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        const studentResponse = await fetchTeacherData();
        setStudent(studentResponse.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, []);

  // Get teacher details from backend
  const get = async () => {
    if (!student) return;
    try {
      const response = await axios.get(`https://collegeconnect-backend.onrender.com/get/${student.email}`);
      setMy(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Fetch student doubts
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const emaill = student?.email;
      const semester = student?.semester;

      const response = await axios.get('https://collegeconnect-backend.onrender.com/doubtss');

      const filteredStudents = response.data.filter(
        (s) => s.semester <= semester && s.Temail === emaill && s.global === "YES"
      );
      const unassignedStudents = response.data.filter(
        (s) => s.Temail === '' && s.semester <= semester && s.global === "YES"
      );

      setStudents([...filteredStudents, ...unassignedStudents]);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student) {
      get();
      if (status === 'Online') {
        fetchStudents();
        const interval = setInterval(fetchStudents, 10000);
        return () => clearInterval(interval);
      }
    }
  }, [student, status, sem]);

  const handleToggleStatus = () => {
    setStatus((prev) => (prev === 'Offline' ? 'Online' : 'Offline'));
    if (status === 'Online') setStudents([]);
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
    const emaill = student.email;
    navigate("/payStatus", { state: { emaill } });
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Center minH="100vh" bg="teal.900" px={4} py={8}>
      <VStack spacing={8} w="full" maxW="900px">
        {/* Header Section */}
        <Box w="full" bg="teal.800" borderRadius="lg" p={6} boxShadow="xl">
          <HStack justifyContent="space-between" mb={4}>
            <Heading size="lg" color="white">
              Global Doubt Dashboard
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
            You can now view and respond to students who raised doubts globally.
          </Text>

          <Divider my={4} borderColor="teal.600" />

          {/* Toggle Online/Offline Button */}
          <Button
            onClick={handleToggleStatus}
            colorScheme={status === 'Offline' ? 'red' : 'green'}
            w={['full', 'auto']}
          >
            {status === 'Offline' ? 'Go Online' : 'Go Offline'}
          </Button>
        </Box>

        {/* Student List */}
        {status === 'Online' && (
          <Box w="full" bg="teal.800" p={6} borderRadius="lg" boxShadow="lg">
            <Heading size="md" color="teal.100" mb={4}>
              Students with Doubts
            </Heading>

            {loading ? (
              <Center py={5}><Spinner size="lg" color="white" /></Center>
            ) : students.length > 0 ? (
              <VStack spacing={6} align="stretch">
                {students.map((stu) => (
                  <Box
                    key={stu._id}
                    p={5}
                    bg="teal.700"
                    rounded="md"
                    border="1px"
                    borderColor="teal.600"
                    _hover={{ bg: 'teal.600' }}
                  >
                    <Stack spacing={3}>
                      <HStack alignItems="flex-start">
                        <Image src={img} boxSize="60px" borderRadius="full" />
                        <Box>
                          <Text fontSize="lg" fontWeight="bold" color="white">
                            {stu.name}
                          </Text>
                          <Text color="gray.300">
                            Semester: {stu.semester}
                          </Text>
                          <Text color="gray.300">
                            Subject: {stu.subject} | Chapter: {stu.chapter}
                          </Text>
                          <Text color="blue.200" mt={2}>
                            {stu.doubt}
                          </Text>
                        </Box>
                      </HStack>

                      <Stack direction={['column', 'row']} spacing={3}>
                        {stu.reesponse === 'pending' ? (
                          <Badge colorScheme="yellow" px={3} py={1}>
                            Awaiting Response
                          </Badge>
                        ) : stu.reesponse === 'accepted' ? (
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={continuee}
                            w={['full', 'auto']}
                          >
                            Ready for Session
                          </Button>
                        ) : (
                          <Button
                            colorScheme="purple"
                            size="sm"
                            onClick={() => handleStudentSelection(stu.email, stu.doubt, stu._id)}
                            w={['full', 'auto']}
                          >
                            Continue
                          </Button>
                        )}

                        <Button
                          onClick={onOpen}
                          leftIcon={<FaComment />}
                          colorScheme="blue"
                          size="sm"
                          variant="outline"
                          w={['full', 'auto']}
                        >
                          Chat
                        </Button>
                      </Stack>
                      {isOpen && <Chatwindow name={stu.name} onClose={onClose} />}
                    </Stack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text color="gray.300" mt={4}>No global student doubts found.</Text>
            )}
          </Box>
        )}
      </VStack>
    </Center>
  );
};

export default GlobalT;

import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Avatar,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  useColorModeValue,
  Stack,
  HStack,
  Center,
  IconButton,
  Spinner,
  Wrap,
  WrapItem,
  Divider,
} from '@chakra-ui/react';
import { FaComment, FaArrowRight, FaRedo } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../index';
import axios from 'axios';
import Chatwindow from './Chatwindow';

// 🔹 DoubtBox Component
const DoubtBox = ({ name, email, semester, price, doubt, _id, readyId, Semail }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [Tname, setTeacherName] = useState("");
  const [account, setAccount] = useState("");
  const [payment, setPayment] = useState("");
  const [sec, setSec] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const boxBg = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('blue.500', 'blue.300');

  const fetchTeacher = async () => {
    try {
      const response = await fetch(`https://collegeconnect-backend.onrender.com/address/${email}`);
      const result = await response.json();
      setAccount(result.account);
      setPayment(result.payment);
      setSec(result.secretCode);
      setTeacherID(result._id);
      setTeacherName(result.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeacher();
    const intervalId = setInterval(() => fetchTeacher(), 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (sec && sec !== "L" && sec !== "") {
      setIsLoading(false);
      deletee();
      navigate("/meet", { state: { sec } });
    } else if (payment === "YES") {
      setIsLoading(true);
    }
  }, [sec]);

  const updateHandler = async () => {
    try {
      setButtonClicked(true);
      await fetch(`https://collegeconnect-backend.onrender.com/status/${Semail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _id }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deletee = async () => {
    try {
      setButtonClicked(true);
      await fetch(`https://collegeconnect-backend.onrender.com/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _id, readyId }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const buyHandler2 = () => {
    navigate("/checkout", {
      state: { name, sec, email, _id, readyId, account, price }
    });
  };

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="xl"
      boxShadow="md"
      bg={boxBg}
      width={['100%', '300px', '360px']}
      position="relative"
      transition="all 0.3s"
      _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
    >
      <HStack spacing={4}>
        <Avatar name={name} src={`https://api.adorable.io/avatars/150/${email}.png`} />
        <Stack spacing={0}>
          <Text fontSize="lg" fontWeight="bold" color={headingColor}>{name}</Text>
          <Text fontSize="sm" color="gray.500">Email: {email}</Text>
          <Text fontSize="sm" color="gray.500">Semester: {semester}</Text>
          <Text fontSize="sm" color="gray.500">Doubt: {doubt}</Text>
          <Text fontSize="sm" color="gray.500">Rating: <strong>1</strong></Text>
          <Text fontSize="sm" fontWeight="semibold" color="teal.500">
            Rate: {price > 0 ? `₹${price}` : 'Free'}
          </Text>
        </Stack>
      </HStack>

      <HStack spacing={4} mt={4} justify="center">
        <Button onClick={onOpen} leftIcon={<FaComment />} colorScheme="blue" variant="outline" size="sm">
          Chat
        </Button>
        {!buttonClicked && (
          <Button
            onClick={updateHandler}
            rightIcon={<FaArrowRight />}
            colorScheme="purple"
            variant="solid"
            size="sm"
          >
            Continue
          </Button>
        )}
      </HStack>

      {buttonClicked && price > 0 && (
        <Center mt={3}>
          <Button onClick={buyHandler2} colorScheme="orange" size="sm" variant="solid">
            Pay via INR
          </Button>
        </Center>
      )}

      {isOpen && <Chatwindow name={Tname} onClose={onClose} />}

      {isLoading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.6)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1"
          borderRadius="xl"
        >
          <Center>
            <Spinner size="xl" color="teal.400" />
            <Text ml={3} fontSize="md" color="white">Please wait...</Text>
          </Center>
        </Box>
      )}
    </Box>
  );
};

// 🔹 Accept Component
const Accept = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { email } = location.state || {};
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentResponse = await axios.get('https://collegeconnect-backend.onrender.com/Sme', {
          withCredentials: true
        });
        const student = studentResponse.data.user;
        setStudent(student);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentData();
  }, []);

  const emaill = student?.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://collegeconnect-backend.onrender.com/data', {
          credentials: "include"
        });
        const result = await response.json();
        const filterData = result.filter((teacher) => teacher.Semail === emaill);
        setData(filterData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [email, emaill]);

  const cardBg = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="100vh" bg={cardBg} p={[4, 8]} pt={10}>
      <Center>
        <Stack spacing={4} align="center" maxW="3xl" textAlign="center">
          <Text fontSize={['2xl', '3xl']} fontWeight="bold">
            Welcome to the Doubt Resolution Hub
          </Text>
          <Text fontSize={['md', 'lg']} color="gray.500">
            Get in touch with an expert to resolve your academic queries instantly.
          </Text>
          <Text fontSize="sm" color="gray.400">Refresh the page periodically to see new teacher responses.</Text>
        </Stack>
      </Center>

      <Center mt={6}>
        <IconButton
          icon={<FaRedo />}
          colorScheme="blue"
          variant="solid"
          size="lg"
          onClick={() => window.location.reload()}
          aria-label="Reload"
          borderRadius="full"
        />
      </Center>

      {/* Cards */}
      <Box pt={10}>
        {loading ? (
          <Center py={10}>
            <Spinner size="xl" color="teal.400" />
          </Center>
        ) : data.length === 0 ? (
          <Center py={10}>
            <Text color="gray.500" fontSize="lg">
              Waiting for teacher to respond...
            </Text>
          </Center>
        ) : (
          <Wrap spacing={6} justify="center" mt={6}>
            {data.map((item, index) => (
              <WrapItem key={index}>
                <DoubtBox
                  name={item.name}
                  email={item.email}
                  semester={item.semester}
                  price={item.price}
                  doubt={item.doubt}
                  _id={item._idS}
                  readyId={item._id}
                  Semail={item.Semail}
                />
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Box>
    </Box>
  );
};

export default Accept;

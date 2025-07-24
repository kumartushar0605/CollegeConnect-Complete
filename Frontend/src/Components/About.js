import React from 'react';
import { Box, Container, Heading, Text, VStack, HStack, keyframes,Icon, Divider, Image,Flex, SimpleGrid, useColorMode } from '@chakra-ui/react';
import { FaGlobe, FaUniversity, FaChalkboardTeacher, FaQuestionCircle, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import img from '../Assests/CC.png'
import img2 from '../Assests/img2.jpg'


const About = () => {
  const MotionBox = motion(Box);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colorChange = keyframes`
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
`;
  // Team members data
  const teamMembers = [
    { name: 'Tushar', role: 'Full stack developer', imageUrl: img2 },
    
  ];

  return (
    <Container maxW="container.lg" p={6} centerContent>
      <VStack spacing={6} align="start">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          w="full"
        >
          <Heading as="h1" size="2xl" textAlign="center" color={isDark ? 'gray.100' : 'gray.800'}>
            About College Connect
          </Heading>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          w="full"
          textAlign="center"
        >
          <Image
           boxSize="150px"
           src={img}
           alt="Profile Image"
           borderRadius="full"
           objectFit="cover"
           // boxShadow="0 0 20px rgba(255, 255, 255, 0.7)"
           animation={`${colorChange} 5s infinite linear`}
           boxShadow="0px 10px 15px rgba(0, 0, 0, 0.4)"
            mx="auto"
            mb={6}
          />
          <Text fontSize="xl" color={isDark ? 'gray.200' : 'gray.700'}>
            Welcome to College Connect, your go-to platform for asking questions and clearing doubts. Whether you're a student looking for help or a peer who can provide answers, this is the place where students can come together to learn and grow.
          </Text>
        </MotionBox>

        <Divider borderColor={isDark ? 'gray.600' : 'gray.300'} />

        <MotionBox
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          w="full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          bg={isDark ? 'gray.700' : 'gray.50'}
          boxShadow="xl"
        >
          <Heading as="h2" size="lg" mb={4} color={isDark ? 'gray.100' : 'gray.800'}>
            Our Mission
          </Heading>
          <Text fontSize="md" color={isDark ? 'gray.200' : 'gray.700'}>
            College Connect aims to foster a collaborative learning environment where students can ask questions and get answers from their peers who are also teachers within the same college and globally. Here's what you can do:
          </Text>
          <VStack spacing={3} mt={4} align="start">
            <HStack>
              <Icon as={FaGlobe} w={6} h={6} color={isDark ? 'gray.300' : 'gray.700'} />
              <Text fontSize="md" color={isDark ? 'gray.300' : 'gray.700'}>Ask questions globally.</Text>
            </HStack>
            <HStack>
              <Icon as={FaUniversity} w={6} h={6} color={isDark ? 'gray.300' : 'gray.700'} />
              <Text fontSize="md" color={isDark ? 'gray.300' : 'gray.700'}>Engage with your college mates.</Text>
            </HStack>
            <HStack>
              <Icon as={FaChalkboardTeacher} w={6} h={6} color={isDark ? 'gray.300' : 'gray.700'} />
              <Text fontSize="md" color={isDark ? 'gray.300' : 'gray.700'}>Be both a student and a teacher.</Text>
            </HStack>
            <HStack>
              <Icon as={FaQuestionCircle} w={6} h={6} color={isDark ? 'gray.300' : 'gray.700'} />
              <Text fontSize="md" color={isDark ? 'gray.300' : 'gray.700'}>Resolve doubts with ease.</Text>
            </HStack>
          </VStack>
        </MotionBox>

     <VStack spacing={8} align="center" w="full" mt={10} mb={10}>
  <Heading
    as="h3"
    size="lg"
    color={isDark ? 'gray.100' : 'gray.800'}
    textAlign="center"
  >
    Meet Our Team
  </Heading>

  <Flex justify="center" align="center" w="full">
    <MotionBox
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      w="full"
      maxW="sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      whileHover={{ scale: 1.05 }}
      bg={isDark ? 'gray.700' : 'gray.50'}
      boxShadow="xl"
      textAlign="center"
    >
      <VStack spacing={4}>
        <Image
          src={img2}
          borderRadius="full"
          boxSize="100px"
          alt="Tushar"
          mx="auto"
        />
        <Heading
          as="h4"
          size="md"
          color={isDark ? 'gray.100' : 'gray.800'}
        >
          Tushar
        </Heading>
        <Text fontSize="sm" color={isDark ? 'gray.300' : 'gray.600'}>
          Full stack developer
        </Text>
      </VStack>
    </MotionBox>
  </Flex>
</VStack>


      </VStack>
    </Container>
  );
};

export default About;

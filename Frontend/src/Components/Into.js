import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  ScaleFade,
  keyframes,
  Image,
  Stack,
  useBreakpointValue,
  Container,
  Flex,
  Highlight,
  Grid,
  GridItem,
  Icon,
  Badge,
  Divider,
  SimpleGrid,
  Circle,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaBookOpen, 
  FaLightbulb, 
  FaClock, 
  FaStar, 
  FaRocket,
  FaHeart,
  FaGlobe,
  FaQuestionCircle,
  FaVideo
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { Typewriter } from 'react-simple-typewriter';
import img from '../Assests/CC.png';

// Enhanced Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(-8px);}
  to { opacity: 1; transform: scale(1) translateY(0);}
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px);}
  to { opacity: 1; transform: translateX(0);}
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px);}
  to { opacity: 1; transform: translateX(0);}
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
`;

const buttonGlow = keyframes`
  0%, 100% { box-shadow: 0 0 24px #ff008099, 0 0 6px #ffc80099;}
  50% { box-shadow: 0 0 54px #ff0080cc, 0 0 24px #ffc800cc;}
`;

const imagePulse = keyframes`
  0% { box-shadow: 0 0 30px 8px #72e0ff66; }
  50% { box-shadow: 0 0 84px 24px #ffe08544; }
  100% { box-shadow: 0 0 30px 8px #72e0ff66; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(1deg); }
  66% { transform: translateY(4px) rotate(-1deg); }
`;

const cardHover = keyframes`
  0% { transform: translateY(0px); box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  100% { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
`;

const Intro = () => {
  const { isAuthenticated, TeIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);
  const [showLearnerOptions, setShowLearnerOptions] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Enhanced responsive sizing
  const titleSize = useBreakpointValue({ base: '3xl', md: '3xl', lg: '3xl', xl: '3xl' });
  const subtitleSize = useBreakpointValue({ base: 'xl', md: 'xl', lg: 'xl', xl: 'xl' });
  const imageSize = useBreakpointValue({ base: '180px', md: '240px', lg: '280px', xl: '320px' });
  const buttonWidth = useBreakpointValue({ base: 'full', md: '300px', lg: '320px', xl: '350px' });
  const boxContentWidth = useBreakpointValue({ base: '100%', md: '900px', lg: '1100px', xl: '1200px' });

  // Auto-rotating features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => setShowButtons(true);
  const handleLearner = () => setShowLearnerOptions(true);

  const teacher = () => {
    TeIsAuthenticated ? navigate('/home2') : navigate('/ress', { state: { tea: 'teacher' } });
  };

  const collegeStudent = () => {
    isAuthenticated ? navigate('/home') : navigate('/res', { state: { stu: 'college_student' } });
  };

  const schoolStudent = () => navigate('/subs');

  const features = [
  { icon: FaQuestionCircle, text: "Raise doubts instantly — college or global", color: "blue.400" },
  { icon: FaVideo, text: "Live 1-on-1 sessions with student mentors", color: "green.400" },
  { icon: FaRocket, text: "Learn and earn — help others", color: "purple.400" },
  { icon: FaGlobe, text: "Connect with mentors across the world", color: "teal.400" }
];


const stats = [
  { number: "Coming Soon", label: "Active Learners", icon: FaUsers, color: "blue" },
  { number: "Register Now", label: "Student Mentors", icon: FaChalkboardTeacher, color: "green" },
  { number: "∞", label: "Doubts You Can Solve", icon: FaLightbulb, color: "yellow" },
  { number: "By Students ❤️", label: "Built for the Student Community", icon: FaStar, color: "orange" }
];


 const benefits = [
  {
    icon: FaClock,
    title: "Instant Doubt Solving",
    description: "Get your doubts solved anytime through live student-to-student sessions.",
    gradient: "linear(to-br, blue.400, cyan.300)"
  },
  {
    icon: FaBookOpen,
    title: "Learn From Real Students",
    description: "Mentors who recently learned the same topic guide you with practical clarity.",
    gradient: "linear(to-br, purple.400, pink.300)"
  },
  {
    icon: FaHeart,
    title: "Earn While Teaching",
    description: "Student mentors earn money for solving doubts in live sessions.",
    gradient: "linear(to-br, green.400, teal.300)"
  },
  {
    icon: FaGraduationCap,
    title: "Grow Your Skills",
    description: "Boost confidence, communication, and subject mastery by teaching others.",
    gradient: "linear(to-br, orange.400, yellow.300)"
  }
];


  return (
    <Box
      minH="100vh"
      w="100vw"
      bgGradient="radial(at 80% 20%, #66d4ff26 0%, #1a202c 40%, #171923 100%)"
      position="relative"
      overflowX="hidden"
    >
      {/* Floating Background Elements */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        w="100px"
        h="100px"
        bg="blue.400"
        opacity={0.1}
        borderRadius="full"
        animation={`${floatAnimation} 6s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        top="60%"
        right="10%"
        w="80px"
        h="80px"
        bg="purple.400"
        opacity={0.1}
        borderRadius="full"
        animation={`${floatAnimation} 8s ease-in-out infinite reverse`}
      />

      <Container maxW="8xl" centerContent py={8}>
        {/* Hero Section */}
        <Flex
          direction={['column', 'column', 'row']}
          align="stretch"
          justify="center"
          w="100%"
          maxW={boxContentWidth}
          rounded="3xl"
          bg="whiteAlpha.100"
          backdropFilter="blur(20px)"
          boxShadow="2xl"
          p={{ base: 8, md: 12, lg: 16 }}
          animation={`${fadeIn} 1.6s`}
          minH={{ base: "80vh", md: "70vh", lg: "600px" }}
          mb={16}
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          {/* Left: Text Section */}
          <VStack
            spacing={8}
            w="full"
            maxW={['100%', '100%', '60%']}
            align="flex-start"
            justify="center"
            py={{ base: 8, lg: 0 }}
            textAlign="left"
            animation={`${slideInLeft} 1.2s ease-out`}
          >
            <VStack spacing={8}  align="flex-start">
              <Text
                fontSize={titleSize}
                fontWeight="black"
                color="white"
                letterSpacing="-0.02em"
                textShadow="0 0 30px rgba(79, 209, 197, 0.5)"
                mb={0}
                lineHeight="1.1"
              >
                Welcome to{' '}
                <Text 
                  as="span" 
                  bgGradient="linear(to-r, #4FD1C5, #38B2AC, #319795)"
                  bgClip="text"
                  position="relative"
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '-6px',
                    left: '0',
                    width: '100%',
                    height: '3px',
                    background: 'linear-gradient(90deg, #4FD1C5, #38B2AC)',
                    borderRadius: 'full'
                  }}
                >
                  CollegeConnect
                </Text>
              </Text>

              <HStack spacing={2} flexWrap="wrap">
                <Badge 
                  colorScheme="teal" 
                  fontSize={['sm', 'md']}
                  px={3} 
                  py={1} 
                  rounded="full"
                  bg="teal.500"
                  color="white"
                  boxShadow="0 4px 12px rgba(56, 178, 172, 0.4)"
                >
                  🎓 Learn
                </Badge>
                <Badge 
                  colorScheme="blue" 
                  fontSize={['sm', 'md']}
                  px={3} 
                  py={1} 
                  rounded="full"
                  bg="blue.500"
                  color="white"
                  boxShadow="0 4px 12px rgba(66, 153, 225, 0.4)"
                >
                  🤝 Connect
                </Badge>
                <Badge 
                  colorScheme="purple" 
                  fontSize={['sm', 'md']}
                  px={3} 
                  py={1} 
                  rounded="full"
                  bg="purple.500"
                  color="white"
                  boxShadow="0 4px 12px rgba(159, 122, 234, 0.4)"
                >
                  🚀 Grow
                </Badge>
              </HStack>

              <Text 
                fontSize={subtitleSize} 
                color="gray.200" 
                fontWeight="semibold"
                textShadow="0 2px 8px rgba(0,0,0,0.4)"
                maxW="600px"
                lineHeight="1.4"
              >
                Your ultimate platform for academic excellence and collaborative learning
              </Text>
            </VStack>

            {/* Animated Feature Display */}
            <Flex align="center" minH="60px">
              <Icon as={features[currentFeature].icon} boxSize={8} color={features[currentFeature].color} mr={4} />
              <Box fontSize={['lg', 'xl', '2xl']} color="teal.100" fontWeight="semibold">
                <Typewriter
                  words={features.map(f => f.text)}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={60}
                  deleteSpeed={30}
                  delaySpeed={2150}
                />
              </Box>
            </Flex>

            {/* Action Buttons */}
            {!showButtons && (
              <Button
                size="lg"
                width={buttonWidth}
                fontSize={['lg', 'xl']}
                onClick={handleGetStarted}
                animation={`${buttonGlow} 2s infinite`}
                transition="all 0.25s"
                bgGradient="linear(to-r, #FF6B6B, #4ECDC4)"
                color="white"
                fontWeight="bold"
                _hover={{
                  transform: 'scale(1.08)',
                  boxShadow: '0 0 50px rgba(255, 107, 107, 0.6), 0 0 100px rgba(78, 205, 196, 0.3)',
                  bgGradient: "linear(to-r, #FF5252, #26C6DA)"
                }}
                _active={{ transform: 'scale(0.97)' }}
                mt={6}
                py={7}
              >
                🚀 Get Started Now
              </Button>
            )}

            {showButtons && !showLearnerOptions && (
              <ScaleFade in={showButtons}>
                <VStack spacing={5} mt={2} align="stretch">
                  <Button
                    size="lg"
                    width={buttonWidth}
                    fontSize={['lg', 'xl']}
                    onClick={handleLearner}
                    bgGradient="linear(to-r, blue.400, cyan.300)"
                    color="white"
                    fontWeight="bold"
                    py={7}
                    leftIcon={<FaGraduationCap />}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                  >
                    I'm a Learner
                  </Button>
                  <Button
                    size="lg"
                    width={buttonWidth}
                    fontSize={['lg', 'xl']}
                    onClick={teacher}
                    bgGradient="linear(to-r, pink.400, purple.300)"
                    color="white"
                    fontWeight="bold"
                    py={7}
                    leftIcon={<FaChalkboardTeacher />}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                  >
                    Freelancing Tutor
                  </Button>
                </VStack>
              </ScaleFade>
            )}

            {showLearnerOptions && (
              <ScaleFade in={showLearnerOptions}>
                <VStack spacing={5} align="stretch" mt={2}>
                  <Button
                    size="lg"
                    width={buttonWidth}
                    fontSize={['lg', 'xl']}
                    onClick={collegeStudent}
                    bgGradient="linear(to-r, green.400, teal.300)"
                    color="white"
                    fontWeight="bold"
                    py={7}
                    leftIcon={<FaGraduationCap />}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                  >
                    College Student
                  </Button>
                 
                  <Button
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    size="sm"
                    width="fit-content"
                    alignSelf="start"
                    mt={-2}
                    fontWeight="bold"
                    onClick={() => setShowLearnerOptions(false)}
                    _hover={{ color: 'cyan.200', bg: 'whiteAlpha.200' }}
                    leftIcon={<Text>←</Text>}
                  >
                    Go Back
                  </Button>
                </VStack>
              </ScaleFade>
            )}
          </VStack>

          {/* Right: Image Section */}
          <Flex
            flex={1}
            align="center"
            justify="center"
            ml={{ base: 0, lg: 14 }}
            mt={{ base: 12, lg: 0 }}
            animation={`${slideInRight} 1.2s ease-out`}
          >
            <Box position="relative">
              <Image
                src={img}
                boxSize={imageSize}
                minW={['150px', '200px']}
                borderRadius="full"
                alt="CollegeConnect Hero"
                objectFit="cover"
                animation={`${imagePulse} 2.2s infinite`}
                filter="drop-shadow(0 0 32px #6ee7f9aa)"
                shadow="2xl"
                transition="all 0.3s"
                _hover={{
                  transform: 'scale(1.06)',
                  boxShadow: '0 0 70px rgba(110, 231, 249, 0.8)'
                }}
              />
              {/* Decorative rings */}
              <Circle
                size="400px"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                border="2px solid"
                borderColor="cyan.400"
                opacity={0.3}
                animation={`${floatAnimation} 8s ease-in-out infinite`}
              />
              <Circle
                size="320px"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                border="1px solid"
                borderColor="purple.400"
                opacity={0.2}
                animation={`${floatAnimation} 6s ease-in-out infinite reverse`}
              />
            </Box>
          </Flex>
        </Flex>

        {/* Stats Section */}
        <Box w="100%" maxW={boxContentWidth} mb={16} animation={`${slideInUp} 1.4s ease-out`}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <Box
                key={index}
                bg="whiteAlpha.100"
                backdropFilter="blur(20px)"
                p={6}
                rounded="2xl"
                textAlign="center"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  bg: 'whiteAlpha.200'
                }}
                transition="all 0.3s"
                animation={`${slideInUp} ${1.6 + index * 0.1}s ease-out`}
              >
                <Icon as={stat.icon} boxSize={8} color={`${stat.color}.400`} mb={3} />
                <Text fontSize="2xl" fontWeight="black" color="white" mb={1}>
                  {stat.number}
                </Text>
                <Text fontSize="sm" color="gray.300" fontWeight="semibold">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Benefits Section */}
        <Box w="100%" maxW={boxContentWidth} animation={`${slideInUp} 1.6s ease-out`}>
          <VStack spacing={8} mb={8}>
            <Text
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="black"
              bgGradient="linear(to-r, cyan.400, blue.500, purple.500)"
              bgClip="text"
              textAlign="center"
            >
              Why Choose CollegeConnect?
            </Text>
            <Divider borderColor="whiteAlpha.300" />
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {benefits.map((benefit, index) => (
              <Box
                key={index}
                bg="whiteAlpha.100"
                backdropFilter="blur(20px)"
                p={8}
                rounded="2xl"
                textAlign="center"
                border="1px solid"
                borderColor="whiteAlpha.200"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                  bg: 'whiteAlpha.200'
                }}
                transition="all 0.4s"
                animation={`${slideInUp} ${1.8 + index * 0.15}s ease-out`}
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  h="4px"
                  bgGradient={benefit.gradient}
                />
                <Circle
                  size="60px"
                  bgGradient={benefit.gradient}
                  mb={4}
                  mx="auto"
                >
                  <Icon as={benefit.icon} boxSize={6} color="white" />
                </Circle>
                <Text fontSize="xl" fontWeight="bold" color="white" mb={3}>
                  {benefit.title}
                </Text>
                <Text fontSize="sm" color="gray.300" lineHeight="1.6">
                  {benefit.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

export default Intro;
import React, { useContext, useState } from 'react';
import { 
  Box, 
  Button, 
  Center, 
  FormControl, 
  FormLabel, 
  keyframes,
  Input, 
  Stack, 
  Text, 
  useColorModeValue, 
  useBreakpointValue, 
  Link, 
  Image, 
  Flex,
  Container,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  ScaleFade
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../index';
import img from "../Assests/CC.png";

const TechReg = () => {
  const location = useLocation();
  const item = location.state || '';
  const { setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  // Keyframe animations
  const colorChange = keyframes`
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  `;

  const slideUp = keyframes`
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  `;

  const fadeIn = keyframes`
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  `;

  // Color mode values
  const formBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const buttonBg = useColorModeValue('blue.500', 'blue.200');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.300');
  const bgGradient = useColorModeValue('gray.50', 'gray.900');

  // Responsive values
  const formWidth = useBreakpointValue({ base: '100%', sm: '400px', md: '450px' });
  const imageSize = useBreakpointValue({ base: '150px', sm: '350px', md: '350px', lg: '150px' });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const stackSpacing = useBreakpointValue({ base: 6, md: 8, lg: 12 });
  const formPadding = useBreakpointValue({ base: 6, md: 8 });

  // State to capture form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('https://collegeconnect-backend.onrender.com/registerr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      
      if (res.status === 201) {
        setIsAuthenticated(true);
        setIsSuccess(true);
        setMessage(data.success);
        // Small delay before navigation for better UX
        setTimeout(() => {
          navigate('/det2', { state: { email, name } });
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={bgGradient}
      bgGradient={useColorModeValue(
        'linear(to-br, gray.50, blue.50)',
        'linear(to-br, gray.900, blue.900)'
      )}
    >
      <Container maxW="7xl" py={containerPadding}>
        <Box
              mt={{ base: 8, lg: 0 }}
              animation={`${slideUp} 0.8s ease-out`}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box position="relative">
                <Image
                  boxSize={imageSize}
                  src={img}
                  alt="CollegeConnect Logo"
                  borderRadius="full"
                  objectFit="cover"
                  animation={`${colorChange} 5s infinite linear`}
                  boxShadow="0px 20px 40px rgba(0, 0, 0, 0.1)"
                  border="4px solid"
                  borderColor={useColorModeValue('white', 'gray.700')}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: '0px 25px 50px rgba(0, 0, 0, 0.2)'
                  }}
                />
                {/* Decorative elements */}
                <Box
                  position="absolute"
                  top="-10px"
                  left="-10px"
                  right="-10px"
                  bottom="-10px"
                  borderRadius="full"
                  border="2px dashed"
                  borderColor={useColorModeValue('blue.200', 'blue.400')}
                  animation={`${colorChange} 8s infinite linear reverse`}
                  opacity={0.6}
                />
              </Box>
            </Box>
        <Center minH="100vh" mt={10}>
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="center"
            gap={stackSpacing}
            width="100%"
            maxW="1200px"
          >
            {/* Registration Form */}
            <Box
              p={formPadding}
              width={formWidth}
              borderWidth={1}
              borderRadius="xl"
              borderColor={borderColor}
              boxShadow="2xl"
              bg={formBg}
              animation={`${fadeIn} 0.6s ease-out`}
              backdropFilter="blur(10px)"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'xl',
                padding: '2px',
                background: useColorModeValue(
                  'linear-gradient(45deg, blue.400, purple.400)',
                  'linear-gradient(45deg, blue.200, purple.200)'
                ),
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'exclude',
                zIndex: -1
              }}
            >
              {/* Header */}
              <VStack spacing={4} mb={6}>
                <Text
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="bold"
                  textAlign="center"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  bgClip="text"
                >
                  Create Account
                </Text>
                <Text
                  fontSize="sm"
                  color={useColorModeValue('gray.600', 'gray.400')}
                  textAlign="center"
                >
                  Join CollegeConnect today
                </Text>
              </VStack>

              <Stack spacing={5} as="form" onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Full Name
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    focusBorderColor="blue.400"
                    borderRadius="lg"
                    size="lg"
                    bg={useColorModeValue('white', 'gray.800')}
                    _hover={{
                      borderColor: useColorModeValue('blue.300', 'blue.400')
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    focusBorderColor="blue.400"
                    borderRadius="lg"
                    size="lg"
                    bg={useColorModeValue('white', 'gray.800')}
                    _hover={{
                      borderColor: useColorModeValue('blue.300', 'blue.400')
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor="blue.400"
                    borderRadius="lg"
                    size="lg"
                    bg={useColorModeValue('white', 'gray.800')}
                    _hover={{
                      borderColor: useColorModeValue('blue.300', 'blue.400')
                    }}
                  />
                </FormControl>

                <Button
                  bg={buttonBg}
                  color="white"
                  size="lg"
                  mt={6}
                  borderRadius="lg"
                  _hover={{
                    bg: buttonHoverBg,
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg'
                  }}
                  _active={{
                    transform: 'translateY(0)'
                  }}
                  transition="all 0.2s"
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Creating Account..."
                  fontWeight="semibold"
                >
                  Create Account
                </Button>

                {/* Message display */}
                {message && (
                  <ScaleFade initialScale={0.9} in={!!message}>
                    <Alert
                      status={isSuccess ? "success" : "error"}
                      borderRadius="lg"
                      variant="left-accent"
                    >
                      <AlertIcon />
                      <AlertDescription fontSize="sm">
                        {message}
                      </AlertDescription>
                    </Alert>
                  </ScaleFade>
                )}

                {/* Already registered link */}
                <Text textAlign="center" mt={4} fontSize="sm">
                  Already have an account?{' '}
                  <Link
                    color="blue.500"
                    fontWeight="semibold"
                    onClick={() => navigate('/Tlogin')}
                    _hover={{
                      color: 'blue.600',
                      textDecoration: 'underline'
                    }}
                  >
                    Sign in
                  </Link>
                </Text>
              </Stack>
            </Box>

            {/* Image Section */}
            
          </Flex>
        </Center>
      </Container>
    </Box>
  );
};

export default TechReg;
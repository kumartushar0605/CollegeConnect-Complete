import React, { useState,useEffect } from 'react';
import { 
    Box, 
    Button, 
    Heading, 
    Text, 
    VStack, 
    Container,
    Icon,
    useColorModeValue,
    Flex,
    SimpleGrid,
    Badge,
    HStack,
    useToast,
    Divider,
    Stack
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';

// Mock icons since we can't import react-icons in this environment
const SchoolIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
    </svg>
);

const GlobeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 19.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
    </svg>
);

const Page = () => {
    const [selectedCard, setSelectedCard] = useState(null);
        const [student, setStudent] = useState(null);
        const location = useLocation();
    const navigate = useNavigate();
    const { sem, email, name } = location.state || '';
    
    const toast = useToast();

    // Mock data for demonstration

    // Color mode values for better theme support
    const bgGradient = useColorModeValue(
        'linear(135deg, blue.50 0%, purple.50 50%, pink.50 100%)',
        'linear(135deg, gray.900 0%, purple.900 50%, pink.900 100%)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardShadow = useColorModeValue('xl', 'dark-lg');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

          useEffect(() => {
          const fetchStudentData = async () => {
            try {
             const studentResponse = await axios.get('https://collegeconnect-backend.onrender.com/Sme', { withCredentials: true });
                   const student = studentResponse.data.user;
              setStudent(student);
            } catch (err) {
               
            }
          };
          console.log("hi tusars")
      
          fetchStudentData();
        }, []);

    const handleSemesterClick = () => {
        setSelectedCard('semester');
        toast({
            title: "Semester Questions Selected",
            description: `Navigating to your semester  ${student?.semester} section`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
                navigate("/home", { state: { sem, email, name } });
 
    };


    

    const handleGlobalClick = () => {
        setSelectedCard('global');
        toast({
            title: "Global Community Selected",
            description: "Joining the global discussion community",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
         navigate("/globals");
    };

    const FeatureCard = ({ 
        id,
        icon, 
        title, 
        description, 
        buttonText, 
        onClick, 
        gradientFrom,
        gradientTo,
        badge
    }) => {
        const isSelected = selectedCard === id;
        
        return (
            <Box
                bg={cardBg}
                borderRadius="3xl"
                boxShadow={isSelected ? '2xl' : cardShadow}
                border="1px"
                borderColor={isSelected ? gradientFrom : borderColor}
                p={8}
                width="100%"
                maxWidth="450px"
                position="relative"
                overflow="hidden"
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                transform={isSelected ? 'translateY(-8px) scale(1.02)' : 'translateY(0px) scale(1)'}
                _hover={{
                    transform: 'translateY(-12px) scale(1.03)',
                    boxShadow: '2xl',
                    borderColor: gradientFrom,
                }}
                cursor="pointer"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    bgGradient: `linear(to-r, ${gradientFrom}, ${gradientTo})`,
                    borderTopRadius: '3xl',
                }}
            >
                {badge && (
                    <Badge
                        position="absolute"
                        top={4}
                        right={4}
                        colorScheme="purple"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                    >
                        {badge}
                    </Badge>
                )}

                <VStack spacing={8} align="center">
                    {/* Icon with enhanced styling */}
                    <Flex
                        w={20}
                        h={20}
                        borderRadius="3xl"
                        bgGradient={`linear(135deg, ${gradientFrom}, ${gradientTo})`}
                        align="center"
                        justify="center"
                        boxShadow="lg"
                        position="relative"
                        transition="all 0.3s ease"
                        _hover={{ 
                            transform: 'rotate(5deg) scale(1.1)',
                            boxShadow: 'xl'
                        }}
                        _before={{
                            content: '""',
                            position: 'absolute',
                            inset: '-2px',
                            borderRadius: '3xl',
                            padding: '2px',
                            bgGradient: `linear(135deg, ${gradientFrom}, ${gradientTo})`,
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'exclude',
                        }}
                    >
                        <Box color="white">
                            {icon}
                        </Box>
                    </Flex>

                    {/* Content */}
                    <VStack spacing={4} textAlign="center">
                        <Heading 
                            as="h3" 
                            size="xl" 
                            color={headingColor}
                            fontWeight="bold"
                            lineHeight="shorter"
                            bgGradient={`linear(135deg, ${gradientFrom}, ${gradientTo})`}
                            bgClip="text"
                        >
                            {title}
                        </Heading>
                        
                        <Text 
                            fontSize="lg" 
                            color={textColor}
                            lineHeight="tall"
                            textAlign="center"
                            maxW="sm"
                        >
                            {description}
                        </Text>
                    </VStack>

                    <Divider opacity={0.3} />

                    {/* Enhanced Button */}
                    <Button
                        onClick={onClick}
                        size="lg"
                        fontWeight="semibold"
                        borderRadius="2xl"
                        px={10}
                        py={6}
                        h="auto"
                        rightIcon={<ArrowRightIcon />}
                        bgGradient={`linear(135deg, ${gradientFrom}, ${gradientTo})`}
                        color="white"
                        border="none"
                        position="relative"
                        overflow="hidden"
                        _hover={{
                            bgGradient: `linear(135deg, ${gradientTo}, ${gradientFrom})`,
                            transform: 'translateY(-3px)',
                            boxShadow: 'xl',
                        }}
                        _active={{
                            transform: 'translateY(-1px)',
                        }}
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'left 0.5s ease',
                        }}
                        _hover_before={{
                            left: '100%',
                        }}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    >
                        {buttonText}
                    </Button>
                </VStack>
            </Box>
        );
    };

    return (
        <Box
            minH="100vh"
            bgGradient={bgGradient}
            position="relative"
            overflow="hidden"
        >
            {/* Animated background elements */}
            <Box
                position="absolute"
                top="15%"
                right="10%"
                w="300px"
                h="300px"
                borderRadius="full"
                bgGradient="radial(circle, blue.300 0%, transparent 70%)"
                opacity={0.1}
                animation="float 8s ease-in-out infinite"
            />
            <Box
                position="absolute"
                bottom="20%"
                left="5%"
                w="250px"
                h="250px"
                borderRadius="full"
                bgGradient="radial(circle, purple.300 0%, transparent 70%)"
                opacity={0.1}
                animation="float 12s ease-in-out infinite reverse"
            />
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="400px"
                h="400px"
                borderRadius="full"
                bgGradient="radial(circle, pink.200 0%, transparent 70%)"
                opacity={0.05}
                animation="pulse 6s ease-in-out infinite"
            />

            {/* Main content */}
            <Container maxW="8xl" py={20} px={8}>
                <VStack spacing={20} align="center">
                    {/* Enhanced header section */}
                    <VStack spacing={8} textAlign="center" maxW="4xl">
                        <Badge 
                            colorScheme="purple" 
                            borderRadius="full" 
                            px={4} 
                            py={2} 
                            fontSize="sm"
                            textTransform="none"
                        >
                            Welcome {student?.name} ✨
                        </Badge>
                        
                        <Heading
                            as="h1"
                            fontSize={{ base: "4xl", md: "6xl" }}
                            color={headingColor}
                            fontWeight="black"
                            lineHeight="shorter"
                            bgGradient="linear(135deg, blue.600, purple.600, pink.500)"
                            bgClip="text"
                            letterSpacing="tight"
                        >
                            Choose Your Learning Path
                        </Heading>
                        
                        <Text
                            fontSize={{ base: "lg", md: "xl" }}
                            color={textColor}
                            lineHeight="tall"
                            maxW="2xl"
                            fontWeight="medium"
                        >
                            Whether you need help with semester-specific topics or want to engage 
                            with our global community of learners, we've created the perfect 
                            environment for your educational journey.
                        </Text>

                        <HStack spacing={6} flexWrap="wrap" justify="center">
                            <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                                Interactive Learning
                            </Badge>
                            <Badge colorScheme="purple" variant="subtle" px={3} py={1}>
                                Peer Support
                            </Badge>
                            <Badge colorScheme="pink" variant="subtle" px={3} py={1}>
                                Global Community
                            </Badge>
                        </HStack>
                    </VStack>

                    {/* Enhanced cards section */}
                    <SimpleGrid
                        columns={{ base: 1, xl: 2 }}
                        spacing={16}
                        w="100%"
                        maxW="6xl"
                        justifyItems="center"
                    >
                        <FeatureCard
                            id="semester"
                            icon={<SchoolIcon />}
                            title="Semester Hub"
                            description="Dive deep into your current semester topics. Get personalized help with coursework, collaborate on assignments, and connect with classmates in your academic journey."
                            buttonText="Enter Semester Hub"
                            onClick={handleSemesterClick}
                            gradientFrom="blue.400"
                            gradientTo="blue.600"
                            badge="Academic"
                        />

                        <FeatureCard
                            id="global"
                            icon={<GlobeIcon />}
                            title="Global Forum"
                            description="Expand your horizons beyond the classroom. Engage with learners worldwide, explore diverse perspectives, and participate in enriching discussions that transcend academic boundaries."
                            buttonText="Join Global Community"
                            onClick={handleGlobalClick}
                            gradientFrom="purple.400"
                            gradientTo="pink.500"
                            badge="Community"
                        />
                    </SimpleGrid>

                    {/* Statistics section */}
                    <HStack
                        spacing={12}
                        flexWrap="wrap"
                        justify="center"
                        pt={12}
                        opacity={0.8}
                    >
                       
                        
                    </HStack>
                </VStack>
            </Container>

            {/* CSS animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-30px) rotate(180deg);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.05;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.1);
                        opacity: 0.1;
                    }
                }
            `}</style>
        </Box>
    );
};

export default Page;
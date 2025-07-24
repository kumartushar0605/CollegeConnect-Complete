import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Box, 
    Button, 
    Container, 
    Grid, 
    GridItem, 
    Text, 
    VStack, 
    HStack,
    useColorModeValue, 
    FormControl, 
    FormLabel, 
    Textarea, 
    useToast,
    Spinner,
    Badge,
    Heading,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Icon,
    Flex,
    Progress,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Avatar,
    AvatarBadge,
    SimpleGrid,
    Skeleton,
    SkeletonText,
    IconButton,
    Tooltip
} from '@chakra-ui/react';

// Mock icons
const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h6v14H5zm8 0V5h6v14h-6z"/>
    </svg>
);

const ChapterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
);

const QuestionIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
);

const SendIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);

const Home = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const bgGradient = useColorModeValue(
        'linear(135deg, blue.50 0%, purple.50 100%)',
        'linear(135deg, gray.900 0%, purple.900 100%)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');
    const selectedBg = useColorModeValue('blue.50', 'blue.900');
    const selectedBorder = useColorModeValue('blue.500', 'blue.300');
    const progressBg = useColorModeValue('gray.200', 'gray.700');

    // State variables
    const [sem, setSemester] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [doubt, setDoubt] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    // Fetch student data and subjects on component mount
    useEffect(() => {
        const fetchStudentAndSubjects = async () => {
            setLoading(true);
            try {
                const studentResponse = await axios.get('https://collegeconnect-backend.onrender.com/Sme', { 
                    withCredentials: true 
                });
                const student = studentResponse.data.user;

                // Set the student details
                setSemester(student.semester);
                setEmail(student.email);
                setName(student.name);

                // Now fetch subjects for this semester
                const subjectResponse = await axios.get(`https://collegeconnect-backend.onrender.com/subjects/${student.semester}`);
                const data = subjectResponse.data;
                setSubjects(data.subjects || []);
            } catch (error) {
                console.error('Error fetching student or subjects:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load student data or subjects. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            setLoading(false);
        };

        fetchStudentAndSubjects();
    }, [toast]);

    const handleSubjectClick = (subjectName) => {
        const selectedSubjectData = subjects.find(sub => sub.subjectName === subjectName);
        if (selectedSubjectData) {
            setSelectedSubject(subjectName);
            setChapters(selectedSubjectData.chapters || []);
            setSelectedChapter(null); // Reset selected chapter when a new subject is selected
            setDoubt('');
        }
    };

    const handleChapterClick = (chapter) => {
        setSelectedChapter(chapter);
    };

    const handleDoubtChange = (e) => {
        setDoubt(e.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedChapter || !doubt.trim()) {
            toast({
                title: 'Missing Information',
                description: 'Please select a chapter and enter your doubt.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSubmitting(true);

        try {
            const response = await axios.post('https://collegeconnect-backend.onrender.com/doubts', {
                sem,
                subject: subjects.find(sub => sub.chapters.includes(selectedChapter))?.subjectName,
                chapter: selectedChapter,
                doubt,
                name,
                email,
                global: "NO"
            });

            toast({
                title: 'Doubt Submitted Successfully! 🎉',
                description: `Your question about "${selectedChapter}" has been posted to the community.`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });

            // Reset form
            setSelectedChapter(null);
            setDoubt('');
            
            // Navigate to accept page
            navigate('/accept', { state: { email } });

        } catch (error) {
            console.error('Error submitting doubt:', error);
            toast({
                title: 'Error',
                description: 'Failed to submit your doubt. Please try again later.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }

        setSubmitting(false);
    };

    const resetForm = () => {
        setSelectedSubject(null);
        setChapters([]);
        setSelectedChapter(null);
        setDoubt('');
    };

    if (loading) {
        return (
            <Box minH="100vh" bgGradient={bgGradient}>
                <Container maxW="7xl" py={10}>
                    <VStack spacing={8}>
                        <Card w="100%" maxW="4xl">
                            <CardBody>
                                <Skeleton height="40px" mb={4} />
                                <SkeletonText noOfLines={3} spacing={4} />
                            </CardBody>
                        </Card>
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} w="100%" maxW="4xl">
                                <CardBody>
                                    <Skeleton height="30px" mb={4} />
                                    <SkeletonText noOfLines={2} spacing={4} />
                                </CardBody>
                            </Card>
                        ))}
                    </VStack>
                </Container>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bgGradient={bgGradient}>
            <Container maxW="7xl" py={10}>
                <VStack spacing={8} align="stretch">
                    {/* Header Section */}
                    <Card bg={cardBg} borderRadius="2xl" boxShadow="xl">
                        <CardBody>
                            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                                <VStack align="start" spacing={2}>
                                    <Breadcrumb fontSize="sm" color={textColor}>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink>Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbItem isCurrentPage>
                                            <BreadcrumbLink>Semester Questions</BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </Breadcrumb>
                                    
                                    <Heading 
                                        size="xl" 
                                        color={headingColor}
                                        bgGradient="linear(135deg, blue.600, purple.600)"
                                        bgClip="text"
                                    >
                                        Semester {sem} - Ask Your Doubts
                                    </Heading>
                                    
                                    <Text color={textColor} fontSize="lg">
                                        Select a subject and chapter to ask your question
                                    </Text>
                                </VStack>

                                <VStack align="end" spacing={2}>
                                    <HStack>
                                        <Avatar size="md" name={name}>
                                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                                        </Avatar>
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="bold" color={headingColor}>
                                                {name}
                                            </Text>
                                            <Text fontSize="sm" color={textColor}>
                                                {email}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    
                                    <HStack spacing={2}>
                                        <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                                            Semester {sem}
                                        </Badge>
                                        <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                                            {subjects.length} Subjects
                                        </Badge>
                                    </HStack>
                                </VStack>
                            </Flex>
                        </CardBody>
                    </Card>

                    {/* Progress Indicator */}
                    <Card bg={cardBg} borderRadius="xl">
                        <CardBody py={4}>
                            <VStack spacing={4}>
                                <HStack w="100%" justify="space-between" fontSize="sm" color={textColor}>
                                    <Text>Select Subject</Text>
                                    <Text>Choose Chapter</Text>
                                    <Text>Ask Question</Text>
                                </HStack>
                                <Progress 
                                    value={selectedSubject ? (selectedChapter ? 100 : 66) : 33} 
                                    size="lg" 
                                    borderRadius="full"
                                    bg={progressBg}
                                    colorScheme="blue"
                                />
                            </VStack>
                        </CardBody>
                    </Card>

                    {subjects.length === 0 ? (
                        <Alert status="info" borderRadius="xl" p={6}>
                            <AlertIcon boxSize={6} />
                            <VStack align="start" spacing={2}>
                                <AlertTitle fontSize="lg">Subjects Coming Soon!</AlertTitle>
                                <AlertDescription fontSize="md">
                                    Please wait while your Campus Ambassador adds your semester subjects. 
                                    You can ask your doubts globally in the meantime.
                                </AlertDescription>
                            </VStack>
                        </Alert>
                    ) : (
                        <Grid templateColumns={{ base: "1fr", lg: chapters.length > 0 ? "1fr 1fr" : "1fr" }} gap={8}>
                            {/* Subjects Section */}
                            <GridItem>
                                <Card bg={cardBg} borderRadius="xl" boxShadow="lg" h="fit-content">
                                    <CardHeader pb={2}>
                                        <HStack spacing={3}>
                                            <Icon as={BookIcon} color="blue.500" boxSize={6} />
                                            <Heading size="md" color={headingColor}>
                                                Available Subjects
                                            </Heading>
                                            <Badge colorScheme="blue" borderRadius="full">
                                                {subjects.length}
                                            </Badge>
                                        </HStack>
                                    </CardHeader>
                                    
                                    <Divider />
                                    
                                    <CardBody>
                                        <SimpleGrid columns={1} spacing={3}>
                                            {subjects.map((subject, index) => (
                                                <Card
                                                    key={index}
                                                    variant="outline"
                                                    cursor="pointer"
                                                    transition="all 0.3s ease"
                                                    bg={selectedSubject === subject.subjectName ? selectedBg : 'transparent'}
                                                    borderColor={selectedSubject === subject.subjectName ? selectedBorder : 'transparent'}
                                                    borderWidth={selectedSubject === subject.subjectName ? 2 : 1}
                                                    _hover={{
                                                        bg: selectedSubject === subject.subjectName ? selectedBg : cardHoverBg,
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 'md'
                                                    }}
                                                    onClick={() => handleSubjectClick(subject.subjectName)}
                                                >
                                                    <CardBody py={4}>
                                                        <HStack justify="space-between">
                                                            <VStack align="start" spacing={1} flex={1}>
                                                                <Text 
                                                                    fontWeight="semibold" 
                                                                    color={headingColor}
                                                                    fontSize="md"
                                                                >
                                                                    {subject.subjectName}
                                                                </Text>
                                                                <Text 
                                                                    fontSize="sm" 
                                                                    color={textColor}
                                                                >
                                                                    {subject.chapters?.length || 0} chapters available
                                                                </Text>
                                                            </VStack>
                                                            {selectedSubject === subject.subjectName && (
                                                                <Badge colorScheme="blue" borderRadius="full">
                                                                    Selected
                                                                </Badge>
                                                            )}
                                                        </HStack>
                                                    </CardBody>
                                                </Card>
                                            ))}
                                        </SimpleGrid>
                                    </CardBody>
                                </Card>
                            </GridItem>

                            {/* Chapters and Doubt Form Section */}
                            {chapters.length > 0 && (
                                <GridItem>
                                    <VStack spacing={6} align="stretch">
                                        {/* Chapters Section */}
                                        <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
                                            <CardHeader pb={2}>
                                                <HStack spacing={3}>
                                                    <Icon as={ChapterIcon} color="purple.500" boxSize={6} />
                                                    <VStack align="start" spacing={0}>
                                                        <Heading size="md" color={headingColor}>
                                                            Chapters
                                                        </Heading>
                                                        <Text fontSize="sm" color={textColor}>
                                                            {selectedSubject}
                                                        </Text>
                                                    </VStack>
                                                    <Badge colorScheme="purple" borderRadius="full">
                                                        {chapters.length}
                                                    </Badge>
                                                </HStack>
                                            </CardHeader>
                                            
                                            <Divider />
                                            
                                            <CardBody>
                                                <SimpleGrid columns={1} spacing={2}>
                                                    {chapters.map((chapter, index) => (
                                                        <Button
                                                            key={index}
                                                            variant={selectedChapter === chapter ? "solid" : "ghost"}
                                                            colorScheme={selectedChapter === chapter ? "purple" : "gray"}
                                                            size="md"
                                                            justifyContent="start"
                                                            fontWeight={selectedChapter === chapter ? "bold" : "normal"}
                                                            onClick={() => handleChapterClick(chapter)}
                                                            leftIcon={selectedChapter === chapter ? <ChapterIcon /> : null}
                                                            _hover={{
                                                                transform: 'translateX(4px)',
                                                            }}
                                                            transition="all 0.2s ease"
                                                        >
                                                            {chapter}
                                                        </Button>
                                                    ))}
                                                </SimpleGrid>
                                            </CardBody>
                                        </Card>

                                        {/* Doubt Form Section */}
                                        {selectedChapter && (
                                            <Card bg={cardBg} borderRadius="xl" boxShadow="lg">
                                                <CardHeader pb={2}>
                                                    <HStack spacing={3}>
                                                        <Icon as={QuestionIcon} color="green.500" boxSize={6} />
                                                        <VStack align="start" spacing={0}>
                                                            <Heading size="md" color={headingColor}>
                                                                Ask Your Question
                                                            </Heading>
                                                            <Text fontSize="sm" color={textColor}>
                                                                Chapter: {selectedChapter}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </CardHeader>
                                                
                                                <Divider />
                                                
                                                <CardBody>
                                                    <VStack spacing={6}>
                                                        <FormControl>
                                                            <FormLabel color={headingColor} fontWeight="semibold">
                                                                What's your doubt about "{selectedChapter}"?
                                                            </FormLabel>
                                                            <Textarea
                                                                placeholder="Describe your question in detail. Be specific about what you're struggling with..."
                                                                value={doubt}
                                                                onChange={handleDoubtChange}
                                                                rows={4}
                                                                maxLength={500}
                                                                resize="vertical"
                                                                focusBorderColor="green.400"
                                                                _focus={{
                                                                    boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                                                                }}
                                                            />
                                                            <Text fontSize="xs" color={textColor} mt={1}>
                                                                {doubt.length}/500 characters
                                                            </Text>
                                                        </FormControl>

                                                        <HStack w="100%" spacing={3}>
                                                            <Button
                                                                variant="outline"
                                                                size="lg"
                                                                onClick={resetForm}
                                                                flex={1}
                                                            >
                                                                Reset
                                                            </Button>
                                                            
                                                            <Button
                                                                colorScheme="green"
                                                                size="lg"
                                                                onClick={handleSubmit}
                                                                isLoading={submitting}
                                                                loadingText="Submitting..."
                                                                rightIcon={<SendIcon />}
                                                                flex={2}
                                                                isDisabled={!doubt.trim()}
                                                                bgGradient="linear(135deg, green.400, green.600)"
                                                                color="white"
                                                                _hover={{
                                                                    bgGradient: "linear(135deg, green.500, green.700)",
                                                                    transform: 'translateY(-2px)',
                                                                }}
                                                            >
                                                                Submit Question
                                                            </Button>
                                                        </HStack>
                                                    </VStack>
                                                </CardBody>
                                            </Card>
                                        )}
                                    </VStack>
                                </GridItem>
                            )}
                        </Grid>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default Home;
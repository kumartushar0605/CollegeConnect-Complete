import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Avatar,
  useColorMode,
  useColorModeValue,
  Button,
  Container,
  Input,
  IconButton,
  Stack,
  Textarea,
  FormControl,
  FormLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaThumbsUp, FaComment, FaTrash } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Blog = () => {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const color = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Load posts from local storage when the component mounts
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    setPosts(storedPosts);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    const newPost = {
      title,
      author,
      content,
      image,
      date: new Date().toLocaleDateString(),
      likes: 0,
      comments: [],
    };

    // Save new post to local storage
    const updatedPosts = [...posts, newPost];
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);

    // Clear form fields
    setTitle('');
    setAuthor('');
    setContent('');
    setImage('');
  };

  const handleLike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes += 1;
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const handleComment = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].comments.push(newComment);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    setNewComment('');
    onClose();
  };

  const handleDelete = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const openCommentModal = (index) => {
    setSelectedPostIndex(index);
    onOpen();
  };

  return (
    <Box bg={bg} color={color} minH="100vh" py={10} px={4}>
      <Container maxW="container.xl">
        {/* Header */}
        <HStack justify="space-between" mb={12} align="center">
          <Heading
            as="h1"
            size="2xl"
            fontFamily="Georgia, serif"
            color={useColorModeValue('teal.500', 'teal.200')}
          >
            Community
          </Heading>
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={useColorModeValue(<FaMoon />, <FaSun />)}
            onClick={toggleColorMode}
            variant="ghost"
            size="lg"
          />
        </HStack>

        <Stack direction={['column', 'row']} spacing={10}>
          {/* Blog Post Form */}
          <VStack
            spacing={6}
            align="left"
            p={8}
            boxShadow="2xl"
            borderRadius="xl"
            bg={cardBg}
            w="full"
            maxW="600px"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.02)' }}
          >
            <Input
              placeholder="Blog Post Title"
              size="lg"
              fontWeight="bold"
              variant="flushed"
              focusBorderColor="teal.500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fontSize="2xl"
            />
            <HStack spacing={4} align="center">
              <Avatar name="Author Name" src="https://bit.ly/broken-link" />
              <Input
                placeholder="Author Name"
                size="md"
                variant="flushed"
                focusBorderColor="teal.500"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </HStack>
            <Input
              type="file"
              onChange={handleImageUpload}
              variant="flushed"
              focusBorderColor="teal.500"
              accept="image/*"
            />
            {image && (
              <Image
                src={image}
                alt="Blog image"
                borderRadius="md"
                maxH="300px"
                objectFit="cover"
                mt={4}
              />
            )}
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write your blog content here..."
              style={{ height: '200px', borderRadius: '8px', marginTop: '20px' }}
            />
            <Button
              colorScheme="teal"
              size="lg"
              alignSelf="flex-end"
              boxShadow="lg"
              _hover={{ boxShadow: '2xl' }}
              onClick={handlePublish}
            >
              Publish Post
            </Button>
          </VStack>

          {/* Preview Blog Posts */}
          <Box
            p={8}
            shadow="2xl"
            borderWidth="1px"
            borderRadius="xl"
            bg={cardBg}
            w="full"
          >
            <Heading as="h2" size="lg" mb={4} fontFamily="Georgia, serif">
              Published Posts
            </Heading>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <Box
                  key={index}
                  p={6}
                  mb={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg={cardBg}
                >
                  <VStack spacing={4} align="left">
                    <Heading as="h3" size="lg">
                      {post.title}
                    </Heading>
                    <HStack spacing={4} align="center">
                      <Avatar name={post.author} src="https://bit.ly/broken-link" />
                      <Text fontWeight="bold">{post.author}</Text>
                      <Text>|</Text>
                      <Text>{post.date}</Text>
                    </HStack>
                    {post.image && (
                      <Image
                        src={post.image}
                        alt="Blog image"
                        borderRadius="md"
                        maxH="300px"
                        objectFit="cover"
                      />
                    )}
                    <Box>
                      <Text
                        fontSize="lg"
                        lineHeight="tall"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </Box>
                    <HStack spacing={4} mt={4}>
                      <Button
                        leftIcon={<FaThumbsUp />}
                        colorScheme="teal"
                        variant="outline"
                        onClick={() => handleLike(index)}
                      >
                        Like ({post.likes})
                      </Button>
                      <Button
                        leftIcon={<FaComment />}
                        colorScheme="teal"
                        variant="outline"
                        onClick={() => openCommentModal(index)}
                      >
                        Comment ({post.comments.length})
                      </Button>
                      <Button
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </Button>
                    </HStack>
                    {post.comments.length > 0 && (
                      <Box mt={4}>
                        <Heading as="h4" size="md" mb={2}>
                          Comments:
                        </Heading>
                        {post.comments.map((comment, i) => (
                          <Text key={i} mb={1}>
                            {comment}
                          </Text>
                        ))}
                      </Box>
                    )}
                  </VStack>
                </Box>
              ))
            ) : (
              <Text>No posts available</Text>
            )}
          </Box>
        </Stack>
      </Container>

      {/* Comment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Your Comment</FormLabel>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={() => handleComment(selectedPostIndex)}
            >
              Add Comment
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Blog;

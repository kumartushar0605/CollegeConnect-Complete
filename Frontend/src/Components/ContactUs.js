import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Image,
  VStack,
  HStack,
  useToast,
  useBreakpointValue,
  keyframes,
  Stack
} from '@chakra-ui/react';
import img from '../Assests/CC.png';

const ContactUs = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can integrate email sending logic here.

    toast({
      title: 'Message Sent!',
      description: "We've received your message and will be in touch shortly.",
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });

    setFormData({ name: '', email: '', message: '' });
  };

  const colorChange = keyframes`
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  `;

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg="gray.900" minH="100vh" py={[8, 12]}>
      <Container maxW="6xl">
        
        <Stack
          direction={['column', 'row']}
          spacing={[8, 20]}
          align="center"
          justify="center"
        >
          <Box display="flex" justifyContent="center" w={['100%', '40%']}>
            <Image
              boxSize={["200px", "300px", "350px"]}
              src={img}
              alt="Contact Illustration"
              borderRadius="full"
              objectFit="cover"
              mt={[1,"-180"]}
              animation={`${colorChange} 5s infinite linear`}
              boxShadow="lg"
            />
          </Box>
          {/* Form Section */}
          <Box w={['100%', '60%']} bg="gray.800" p={[6, 8]} borderRadius="lg" boxShadow="lg">
            <VStack spacing={6} align="stretch">
              <Heading as="h1" fontSize={['2xl', '3xl']} color="teal.300">
                Contact Us
              </Heading>
              <Text color="gray.300" fontSize={['sm', 'md']}>
                We'd love to hear from you. Send us your message, and we’ll get back to you.
              </Text>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl id="name" isRequired>
                    <FormLabel color="gray.400">Name</FormLabel>
                    <Input
                      placeholder="Your Name"
                      bg="gray.700"
                      color="white"
                      value={formData.name}
                      onChange={handleInputChange}
                      _placeholder={{ color: 'gray.400' }}
                    />
                  </FormControl>

                  <FormControl id="email" isRequired>
                    <FormLabel color="gray.400">Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      bg="gray.700"
                      color="white"
                      value={formData.email}
                      onChange={handleInputChange}
                      _placeholder={{ color: 'gray.400' }}
                    />
                  </FormControl>

                  <FormControl id="message" isRequired>
                    <FormLabel color="gray.400">Message</FormLabel>
                    <Textarea
                      placeholder="Your Message"
                      bg="gray.700"
                      color="white"
                      value={formData.message}
                      onChange={handleInputChange}
                      _placeholder={{ color: 'gray.400' }}
                      rows={5}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="md"
                    mt={2}
                    w="full"
                  >
                    Send Message
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          {/* Image Section */}
          
        </Stack>
      </Container>
    </Box>
  );
};

export default ContactUs;

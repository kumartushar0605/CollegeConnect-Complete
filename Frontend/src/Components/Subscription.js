import React from 'react';
import { Box, Button, Flex, Heading, Text, useColorMode, useBreakpointValue, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdStar } from 'react-icons/md';

// Create motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const Subscription = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  // Responsive width for larger screens and fixed height
  const boxWidth = useBreakpointValue({ base: "90%", sm: "85%", md: "400px" });
  const boxHeight = "auto"; // Adjust the height as needed or set a fixed value

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      height="100vh"
      bgGradient={isDark ? "linear(to-r, gray.800, gray.900)" : "linear(to-r, teal.100, teal.50)"}
      p={4}
    >
      <Flex
        wrap="wrap"
        justify="center"
        align="center"
        gap={6}
      >
        <MotionBox
          bg={isDark ? "gray.700" : "white"}
          borderRadius="md"
          borderWidth={2}
          borderColor={isDark ? "gray.600" : "gray.300"}
          boxShadow="lg"
          p={4} // Adjust padding to reduce height
          textAlign="center"
          width={boxWidth}
          minHeight={boxHeight} // Set minHeight to ensure the box is not too small
          whileHover={{ scale: 1.05, boxShadow: "xl", borderColor: isDark ? "teal.500" : "teal.400" }}
          transition={{ duration: 0.3 }}
        >
          <Icon as={MdStar} boxSize={10} color={isDark ? "teal.400" : "teal.500"} mb={4} />
          <Heading as="h2" size="lg" mb={4} color={isDark ? "white" : "black"}>
            Monthly Subscription
          </Heading>
          <Text fontSize="4xl" fontWeight="bold" color="teal.400" mb={6}>
            ₹20
          </Text>
          <Text mb={4} lineHeight="1.6" color={isDark ? "gray.300" : "gray.600"}>
            - Unlimited One-to-one video call sessions per month<br />
            - Personalized support from experienced tutors<br />
            - Flexible scheduling for sessions<br />
            - Access to recorded sessions for review
          </Text>
          <MotionButton
            colorScheme="teal"
            size="lg"
            whileHover={{ scale: 1.1, backgroundColor: "teal.600", boxShadow: "md" }}
            transition={{ duration: 0.3 }}
          >
            Subscribe Now
          </MotionButton>
        </MotionBox>
        <MotionBox
          bg={isDark ? "gray.700" : "white"}
          borderRadius="md"
          borderWidth={2}
          borderColor={isDark ? "gray.600" : "gray.300"}
          boxShadow="lg"
          p={4} // Adjust padding to reduce height
          textAlign="center"
          width={boxWidth}
          minHeight={boxHeight} // Set minHeight to ensure the box is not too small
          whileHover={{ scale: 1.05, boxShadow: "xl", borderColor: isDark ? "teal.500" : "teal.400" }}
          transition={{ duration: 0.3 }}
        >
          <Flex justify="center" mb={4}>
            <Icon as={MdStar} boxSize={10} color={isDark ? "teal.400" : "teal.500"} />
            <Icon as={MdStar} boxSize={10} color={isDark ? "teal.400" : "teal.500"} />
            <Icon as={MdStar} boxSize={10} color={isDark ? "teal.400" : "teal.500"} />
          </Flex>
          <Heading as="h2" size="lg" mb={4} color={isDark ? "white" : "black"}>
            Yearly Subscription
          </Heading>
          <Text fontSize="4xl" fontWeight="bold" color="teal.400" mb={6}>
            ₹200
          </Text>
          <Text mb={4} lineHeight="1.6" color={isDark ? "gray.300" : "gray.600"}>
            - Unlimited One-to-one video call sessions per year<br />
            - Priority support from top tutors<br />
            - Flexible scheduling for sessions<br />
            - Access to recorded sessions for review<br />
            - Additional discounts on premium services
          </Text>
          <MotionButton
            colorScheme="teal"
            size="lg"
            whileHover={{ scale: 1.1, backgroundColor: "teal.600", boxShadow: "md" }}
            transition={{ duration: 0.3 }}
          >
            Subscribe Now
          </MotionButton>
        </MotionBox>
      </Flex>
    </Flex>
  );
};

export default Subscription;

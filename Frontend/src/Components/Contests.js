// src/Contests.js
import React from 'react';
import { Box, Heading, Text, Stack, Link, Icon, useColorModeValue, Divider } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import contestsData from "../Contests.json";

const Contests = () => {
    const bgColor = useColorModeValue("gray.50", "gray.800");
    const boxBgColor = useColorModeValue("white", "gray.700");
    const headingColor = useColorModeValue("teal.600", "teal.300");
    const linkColor = useColorModeValue("teal.500", "teal.200");
    const shadowColor = useColorModeValue("rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.4)");

    return (
        <Box bg={bgColor} minHeight="100vh" padding={8}>
            <Stack spacing={8} maxWidth="1200px" margin="0 auto">
                {Object.keys(contestsData).map((platform) => (
                    <Box key={platform}>
                        <Heading size="lg" mb={4} color={headingColor} textAlign="center">
                            {platform} Contests
                        </Heading>
                        <Divider borderColor={headingColor} mb={4} />
                        <Stack spacing={6}>
                            {contestsData[platform].map((contest, index) => (
                                <Box
                                    key={index}
                                    p={6}
                                    bg={boxBgColor}
                                    shadow={`md ${shadowColor}`}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    transition="all 0.3s ease"
                                    _hover={{
                                        transform: 'translateY(-4px)',
                                        shadow: `lg ${shadowColor}`
                                    }}
                                >
                                    <Heading size="md" color={headingColor}>{contest.contestName}</Heading>
                                    <Text mt={2} fontSize="sm" color="gray.600">Date: {contest.contestDate}</Text>
                                    <Text fontSize="sm" color="gray.600">Time: {contest.contestTime}</Text>
                                    <Text fontSize="sm" color="gray.600">Duration: {contest.contestDuration}</Text>
                                    <Link
                                        href={contest.contestLink}
                                        color={linkColor}
                                        isExternal
                                        mt={4}
                                        display="inline-flex"
                                        alignItems="center"
                                        fontWeight="bold"
                                    >
                                        Go to Contest <Icon as={ExternalLinkIcon} ml={2} />
                                    </Link>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default Contests;

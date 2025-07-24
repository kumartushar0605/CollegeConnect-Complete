import React, { useContext, useState, useEffect } from 'react';
import {
  Box, Flex, HStack, Text, IconButton, useDisclosure, Avatar,
  VStack, Drawer, DrawerBody, DrawerHeader, DrawerOverlay,
  DrawerContent, DrawerCloseButton, Button, Divider, Image,
  Menu, MenuButton, MenuList, MenuItem, useColorModeValue,
} from '@chakra-ui/react';

import {
  SettingsIcon,
  ExternalLinkIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';

import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import img from "../Assests/CC.png";
import { Context } from '../index';

const Header = () => {
  const { setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const imageSrc = img;

  const [student, setStudent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const drawerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await axios.get('https://collegeconnect-backend.onrender.com/Sme', {
          withCredentials: true
        });
        setStudent(res.data.user);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
      }
    };

    fetchStudentData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('https://collegeconnect-backend.onrender.com/student/logout', {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      navigate('/');
      onClose();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const profileSS = () => {
    navigate("/profileS");
    onClose();
  };

  const NavigationLinks = ({ isMobile = false, onClose }) => {
    const links = [
      { name: 'Home', path: '/home' },
      { name: 'Teachers', path: '/accept' },
      { name: 'Global', path: '/globals' },
      { name: 'Contest', path: '/contest' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
    ];

    const linkProps = {
      as: Link,
      color: textColor,
      fontWeight: '500',
      _hover: { color: 'teal.400' },
      _active: { color: 'teal.500' },
    };

    if (isMobile) {
      return (
        <VStack spacing={4} align="stretch" px={4}>
          {links.map((link) => (
            <Text
              key={link.path}
              {...linkProps}
              to={link.path}
              onClick={onClose}
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: hoverBg }}
            >
              {link.name}
            </Text>
          ))}
        </VStack>
      );
    }

    return (
      <HStack spacing={8}>
        {links.map((link) => (
          <Text key={link.path} {...linkProps} to={link.path}>
            {link.name}
          </Text>
        ))}
      </HStack>
    );
  };

  return (
    <>
      <Box
        bg={bg}
        borderBottom="1px"
        borderColor={borderColor}
        px={{ base: 4, md: 8 }}
        py={3}
        position="sticky"
        top={0}
        zIndex={1000}
        boxShadow="sm"
      >
        <Flex align="center" maxW="7xl" mx="auto" justify="space-between">
          {/* Left: Avatar + Info */}
          <HStack spacing={4} flex={1}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={
                  <Avatar
                    src={img}
                    size="sm"
                    name={student?.name || "User"}
                    bg="blue.500"
                  />
                }
                aria-label="User Menu"
                variant="ghost"
                borderRadius="full"
              />
              <MenuList>
                <MenuItem icon={<SettingsIcon />} onClick={profileSS}>
                  Profile Settings
                </MenuItem>
                <MenuItem icon={<ExternalLinkIcon />} onClick={handleLogout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>

            <VStack align="start" spacing={0} display={{ base: 'none', sm: 'flex' }}>
              {student?.collegeName && (
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                  {student.collegeName}
                </Text>
              )}
              {student?.name && (
                <Text fontSize="xs" color="gray.500">
                  Welcome, {student.name}
                </Text>
              )}
            </VStack>
          </HStack>

          {/* Desktop Navigation */}
          <Box display={{ base: "none", lg: "block" }}>
            <NavigationLinks />
          </Box>

          {/* Mobile Hamburger Icon */}
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            display={{ base: "flex", lg: "none" }}
            onClick={onOpen}
            aria-label="Open mobile menu"
          />
        </Flex>
      </Box>

      {/* 🔥 Drawer for Mobile */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent bg={drawerBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center">
              <Image src={img} alt="Logo" boxSize="30px" mr={2} />
              <Text fontSize="lg" fontWeight="bold">Menu</Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody pt={4}>
            {/* College Info */}
            {student?.collegeName && (
              <>
                <Text
                  fontSize="xs"
                  color="gray.400"
                  textAlign="center"
                  mb={2}
                  textTransform="uppercase"
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  {student.collegeName}
                </Text>
                <Divider mb={3} />
              </>
            )}

            {/* Navigation Links */}
            <NavigationLinks isMobile={true} onClose={onClose} />

            <Divider my={4} />

            {/* Profile & Logout */}
            <VStack spacing={3} align="stretch" px={4}>
              <Button
                leftIcon={<FaUser />}
                variant="ghost"
                justifyContent="flex-start"
                onClick={profileSS}
                fontSize="md"
              >
                Profile
              </Button>
              <Button
                leftIcon={<FaSignOutAlt />}
                variant="ghost"
                justifyContent="flex-start"
                colorScheme="red"
                fontSize="md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;

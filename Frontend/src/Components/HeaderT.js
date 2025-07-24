import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  Flex,
  Spacer,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Divider,
  Avatar,
  Badge,
  Container
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  HamburgerIcon,
  CloseIcon,
  SettingsIcon,
  ExternalLinkIcon,
  InfoIcon,
  PhoneIcon,
  ViewIcon,
  StarIcon,

} from '@chakra-ui/icons';
import img from "../Assests/CC.png";
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const imageSrc = img;
  const { teacherr, setTeIsAuthenticated } = useContext(Context);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mobileMenuBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  const navigate = useNavigate();
  
  // Show mobile menu on smaller screens
  const showMobileMenu = useBreakpointValue({ base: true, md: false });

  const profileTT = () => {
    navigate("/profileT");
    onClose(); // Close mobile menu when navigating
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch('https://collegeconnect-backend.onrender.com/Tme', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch teacher data: ${response.status}`);
        }

        const data = await response.json();
        setTeacher(data.user);
      } catch (err) {
        console.error('Failed to fetch teacher data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://collegeconnect-backend.onrender.com/teacher/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setTeIsAuthenticated(false);
      navigate('/');
      onClose(); // Close mobile menu when logging out
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close mobile menu when navigating
  };

  const navigationItems = [
    { label: 'Home', path: '/home2', icon: ViewIcon },
    { label: 'Global', path: '/globalt', icon: StarIcon },
    { label: 'About Us', path: '/about', icon: InfoIcon },
    { label: 'Contact Us', path: '/contact', icon: PhoneIcon },
  ];

  return (
    <>
      <Box
        as="header"
        bg={bg}
        borderBottom="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Left Section - Profile Menu and College Name */}
            <HStack spacing={4} flex={1}>
              {/* Profile Menu */}
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={
                    <Avatar
                      src={imageSrc}
                      size="sm"
                      name={teacher?.name || "User"}
                      bg="blue.500"
                    />
                  }
                  aria-label="Profile Options"
                  variant="ghost"
                  borderRadius="full"
                  _hover={{ bg: hoverBg }}
                  _active={{ bg: hoverBg }}
                />
                <MenuList>
                  <MenuItem onClick={profileTT} icon={<SettingsIcon />}>
                    Profile Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout} icon={<ExternalLinkIcon />} color="red.500">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>

              {/* College Name - Hide on mobile to save space */}
              {teacher?.collegeName && (
                <VStack align="start" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                  <Text fontSize="lg" fontWeight="bold" color={textColor} noOfLines={1}>
                    {teacher.collegeName}
                  </Text>
                  {teacher.name && (
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                      Welcome, {teacher.name}
                    </Text>
                  )}
                </VStack>
              )}
            </HStack>

            <Spacer />

            {/* Desktop Navigation */}
            {!showMobileMenu && (
              <HStack spacing={1}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    as={Link}
                    to={item.path}
                    variant="ghost"
                    colorScheme="blue.200"
                    fontWeight="500"
                    
                    leftIcon={<item.icon />}
                    _hover={{ bg: 'blue.500' }} 
                  >
                    {item.label}
                  </Button>
                ))}
              </HStack>
            )}

            {/* Mobile Menu Button */}
            {showMobileMenu && (
              <IconButton
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label="Toggle Menu"
                variant="ghost"
                onClick={isOpen ? onClose : onOpen}
                _hover={{ bg: hoverBg }}
              />
            )}
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={mobileMenuBg}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            <VStack align="start" spacing={2}>
              <HStack spacing={3}>
                <Avatar
                  src={imageSrc}
                  size="md"
                  name={teacher?.name || "User"}
                  bg="blue.500"
                />
                <VStack align="start" spacing={0}>
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    {teacher?.name || 'User'}
                  </Text>
                  <Badge colorScheme="blue" size="sm">
                    Teacher
                  </Badge>
                </VStack>
              </HStack>
              {teacher?.collegeName && (
                <Text fontSize="sm" color="gray.500" noOfLines={2}>
                  {teacher.collegeName}
                </Text>
              )}
            </VStack>
          </DrawerHeader>

          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              {/* Navigation Items */}
              {navigationItems.map((item, index) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  justifyContent="flex-start"
                  leftIcon={<item.icon />}
                  onClick={() => handleNavigation(item.path)}
                  py={6}
                  px={6}
                  borderRadius={0}
                  fontWeight="medium"
                  _hover={{ bg: hoverBg }}
                >
                  {item.label}
                </Button>
              ))}

              <Divider my={4} />

              {/* Profile Actions */}
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<SettingsIcon />}
                onClick={profileTT}
                py={6}
                px={6}
                borderRadius={0}
                fontWeight="medium"
                _hover={{ bg: hoverBg }}
              >
                Profile Settings
              </Button>

              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<ExternalLinkIcon />}
                onClick={handleLogout}
                py={6}
                px={6}
                borderRadius={0}
                fontWeight="medium"
                color="red.500"
                _hover={{ bg: 'red.50', color: 'red.600' }}
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
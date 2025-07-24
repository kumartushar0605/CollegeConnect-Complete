import React, { useEffect, useState } from 'react';
import { Box, Button, Center, useBreakpointValue, Flex,FormControl, FormLabel, Input, Select, Stack, Text, useColorModeValue, HStack } from '@chakra-ui/react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const TechDett = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formBg = useColorModeValue('white', 'gray.700');
  const boxWidth = useBreakpointValue({ base: '90%', md: '500px' });
  const defaultBoxHeight = useBreakpointValue({ base: 'auto', md: '540px' });
  const extendedBoxHeight = useBreakpointValue({ base: 'auto', md: '650px' });

  const [formData, setFormData] = useState({
    semester: '',
    collegeName: '',
    classSection: '',
    skills: []
  });

  const [boxHeight, setBoxHeight] = useState(defaultBoxHeight);
  const [skillInput, setSkillInput] = useState('');
  const { email, name } = location.state || {};

  // Handle form field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle skill input changes
  const handleSkillChange = (e) => {
    setSkillInput(e.target.value);
  };

  // Add skill to array
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  // Remove skill from array
  const handleRemoveSkill = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((_, i) => i !== index)
    }));
  };

  // Adjust box height based on the number of skills
  useEffect(() => {
    if (formData.skills.length > 0) {
      setBoxHeight(extendedBoxHeight);
    } else {
      setBoxHeight(defaultBoxHeight);
    }
  }, [formData.skills, defaultBoxHeight, extendedBoxHeight]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`https://collegeconnect-backend.onrender.com/teaForm/${email}`, {
        semester: formData.semester,
        collegeName: formData.collegeName,
        section: formData.classSection,
        skills: formData.skills  // Send skills as an array
      });
      console.log(response.data);  // handle success/failure response
      const sem = formData.semester;
      navigate("/rate", { state: { sem, email } });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Center minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <Box p={8} width={boxWidth} height={boxHeight} borderWidth={1} borderRadius="lg" boxShadow="lg" bg={formBg}>
        <Text fontSize="2xl" mb={2} textAlign="center">Educator Form</Text>
        <Stack as="form" spacing={4} onSubmit={handleSubmit}>
          
          <FormControl id="collegeName" isRequired>
            <FormLabel>College Name</FormLabel>
            <Input type="text" placeholder="Enter your college name" value={formData.collegeName} onChange={handleInputChange} />
          </FormControl>

          {/* <FormControl id="stream" isRequired>
            <FormLabel>stream</FormLabel>
            <Input type="text" placeholder="Enter your stream"  />
          </FormControl>

          <FormControl id="semester" isRequired>
            <FormLabel>Semester</FormLabel>
            <Select placeholder="Select semester" value={formData.semester} onChange={handleInputChange}>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </Select>
            
          </FormControl> */}

<Flex direction={{ base: 'column', md: 'row' }} gap={4}>
  <FormControl id="semester" isRequired flex={1}>
    <FormLabel>Semester</FormLabel>
    <Input type="Number" placeholder="Enter your semester" value={formData.semester} onChange={handleInputChange} />

  </FormControl>

  <FormControl id="stream" isRequired flex={1}>
    <FormLabel>Stream</FormLabel>
    <Input type="text" placeholder="Enter your stream"  />
  </FormControl>
</Flex>
          
          <FormControl id="classSection" isRequired>
            <FormLabel>Class Section</FormLabel>
            <Input type="text" placeholder="Enter your class section" value={formData.classSection} onChange={handleInputChange} />
          </FormControl>
          
          <FormControl id="skills">
            <FormLabel>Skills</FormLabel>
            <HStack spacing={4} alignItems="center">
              <Input type="text" placeholder="Enter a skill" value={skillInput} onChange={handleSkillChange} />
              <Button colorScheme="blue" onClick={handleAddSkill}>Add Skill</Button>
            </HStack>
            {formData.skills.length > 0 && (
              <Stack mt={4}>
                {formData.skills.map((skill, index) => (
                  <HStack key={index} spacing={4}>
                    <Text>{skill}</Text>
                    <Button size="sm" colorScheme="red" onClick={() => handleRemoveSkill(index)}>Remove</Button>
                  </HStack>
                ))}
              </Stack>
            )}
          </FormControl>
          
          <Button colorScheme="blue" size="lg" mt={4} type="submit">Submit</Button>
        </Stack>
      </Box>
    </Center>
  );
}

export default TechDett;

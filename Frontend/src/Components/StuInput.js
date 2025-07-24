import React, { useState } from 'react';
import { Box, Button, Center, FormControl, FormLabel, Input, Select, Stack, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';

const StuInput = () => {
  const formBg = useColorModeValue('white', 'gray.700');
  const boxWidth = useBreakpointValue({ base: '90%', md: '600px' });

  const [semester, setSemester] = useState('');
  const [numSubjects, setNumSubjects] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});

  // Handle semester selection
  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    setSubjects([]); // Reset subjects
    setChapters({}); // Reset chapters
  };

  // Handle number of subjects change
  const handleNumSubjectsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumSubjects(num);
    setSubjects(new Array(num).fill('')); // Set empty subjects array
    setChapters({}); // Reset chapters
  };

  // Handle subject change
  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = value;
    setSubjects(updatedSubjects);
    setChapters(prev => ({ ...prev, [index]: new Array(chapters[index]?.length || 0).fill('') })); // Reset chapters for this subject
  };

  // Handle number of chapters change
  const handleNumChaptersChange = (subjectIndex, e) => {
    const num = parseInt(e.target.value, 10);
    setChapters(prev => ({
      ...prev,
      [subjectIndex]: new Array(num).fill('')
    }));
  };

  // Handle chapter change
  const handleChapterChange = (subjectIndex, chapterIndex, value) => {
    const updatedChapters = { ...chapters };
    updatedChapters[subjectIndex][chapterIndex] = value;
    setChapters(updatedChapters);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format subjects and chapters
    const formattedSubjects = subjects.map((subject, index) => ({
      subjectName: subject,
      chapters: chapters[index] ? chapters[index].map(chapter => ({ chapterName: chapter })) : []
    }));

    const formData = { semester, subjects: formattedSubjects };

    try {
      const response = await axios.post('https://collegeconnect-backend.onrender.com/update', formData);
      console.log(response.data);
      alert('Data submitted successfully!');
      // Reset form after submission
      setSemester('');
      setNumSubjects(0);
      setSubjects([]);
      setChapters({});
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    }
  };

  return (
    <Center minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <Box p={8} width={boxWidth} borderWidth={1} borderRadius="lg" boxShadow="lg" bg={formBg}>
        <Text fontSize="2xl" mb={6} textAlign="center">Form</Text>
        <Stack as="form" spacing={4} onSubmit={handleSubmit}>
          {/* Semester Selection */}
          <FormControl id="semester" >
            <FormLabel>Semester</FormLabel>
            <Select placeholder="Select semester" value={semester} onChange={handleSemesterChange}>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="stream" >
            <FormLabel>Stream</FormLabel>
            <Input type="text" placeholder="Enter your stream" min="1"  />
          </FormControl>

          {/* Number of Subjects */}
          <FormControl id="numSubjects" >
            <FormLabel>Number of Subjects</FormLabel>
            <Input type="number" placeholder="Enter number of subjects" min="1" value={numSubjects} onChange={handleNumSubjectsChange} />
          </FormControl>

          {/* Subject Inputs */}
          {subjects.map((_, index) => (
            <div key={index}>
              <FormControl id={`subject-${index}`} >
                <FormLabel>Subject {index + 1}</FormLabel>
                <Input type="text" placeholder={`Enter subject ${index + 1}`} value={subjects[index]} onChange={(e) => handleSubjectChange(index, e.target.value)} />
                <FormControl id={`numChapters-${index}`} mt={4} >
                  <FormLabel>Number of Chapters for Subject {index + 1}</FormLabel>
                  <Input type="number" placeholder="Enter number of chapters" min="1" value={chapters[index]?.length || ''} onChange={(e) => handleNumChaptersChange(index, e)} />
                </FormControl>

                {/* Chapter Inputs */}
                {chapters[index] && chapters[index].map((_, chapterIndex) => (
                  <FormControl key={chapterIndex} id={`chapter-${index}-${chapterIndex}`} mt={4} >
                    <FormLabel>Chapter {chapterIndex + 1} for Subject {index + 1}</FormLabel>
                    <Input type="text" placeholder={`Enter chapter ${chapterIndex + 1}`} value={chapters[index][chapterIndex]} onChange={(e) => handleChapterChange(index, chapterIndex, e.target.value)} />
                  </FormControl>
                ))}
              </FormControl>
            </div>
          ))}

          <Button colorScheme="blue" size="lg" mt={4} type="submit">Submit</Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default StuInput;

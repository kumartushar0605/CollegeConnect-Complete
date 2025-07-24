import React, { useState, useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const Meeting = () => {
  const location = useLocation();
  const [roomName, setRoomName] = useState('');
  const { sec } = location.state || '';
  const domain = 'meet.jit.si';
  const externalApiRef = useRef(null);


  useEffect(() => {
    if (sec) {
      setRoomName(sec);
    }
  }, [sec]);

  const [meetingStarted, setMeetingStarted] = useState(false);
  const toast = useToast();

  const startMeeting = () => {
    if (roomName.trim() === '') {
      toast({
        title: 'Room name required.',
        description: 'Please enter a room name to start the meeting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setMeetingStarted(true);
  };

  const handleApiReady = externalApi =>{
    externalApiRef.current = externalApi;

    if(externalApi.current){
      externalApiRef.current.executedCommand("mute",["audio"]);
      externalApiRef.current.addEventListener(
        "participantJoined",
      onParticipantJoined
      )
    }
  };

  const onParticipantJoined = event =>{
    console.log("New participant joined",event);
  }


 useEffect(()=>{
  if(externalApiRef.current){
    externalApiRef.current.removeEventListener(
      "participantJoined",
      onParticipantJoined
    )
  }
 }) 

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-r, teal.500, blue.500)"
    >
      {!meetingStarted ? (
        <VStack
          spacing={6}
          p={8}
          bg="white"
          borderRadius="lg"
          boxShadow="lg"
          maxW="400px"
          w="full"
          textAlign="center"
        >
          <Heading size="lg" color="teal.600">
            YOUR ROOM CODE :
          </Heading>
          <Input
            variant="filled"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            size="md"
            focusBorderColor="teal.500"
            color="black"
            borderColor="teal"
            _hover={{ borderColor: 'teal.400' }}
          />
          <Button
            colorScheme="teal"
            variant="solid"
            size="md"
            w="full"
            onClick={startMeeting}
            mt={4}
          >
            Continue
          </Button>
        </VStack>
      ) : (
        <Box w="100vw" h="100vh" display="flex">
          <JitsiMeeting
            roomName={roomName}
            displayName="YourName" // Replace with actual user name if needed
            domain={domain}
            configOverwrite={{
              startWithAudioMuted:true,
               startWithVideoMuted:true,
              disableDeepLinking :true,
              disableThirdPartyRequests:true,
              prejoinPageEnabled:false,
              enableWelComePage:false,
              enableClosePage:false,
              enableInsecureRoomNameWarning:true,
              enableNoisyMicDetection:true,
              resolution:720
            }}
            onApiReady={handleApiReady}
            interfaceConfigOverwrite={{
              TILE_VIEW_MAX_COLUMNS: 1,
            }}
            containerStyles={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = '100vh';
              iframeRef.style.width = '100vw';
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Meeting;

import React from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignIn() {
  // Chakra color mode
  const history = useHistory(); // Initialize the history object
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
 
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  // const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  // const googleText = useColorModeValue("navy.700", "white");
  // const googleHover = useColorModeValue(
  //   { bg: "gray.200" },
  //   { bg: "whiteAlpha.300" }
  // );

  // const googleActive = useColorModeValue(
  //   { bg: "secondaryGray.300" },
  //   { bg: "whiteAlpha.200" }
  // );

  const handleSignIn = async () => {
    try {
      // Prepare the data to be sent in the request body
      const data = {
        _email: email,
        _password: password,
      };
  
      // Send a POST request to the API using Axios
      const response = await axios.post('https://billing.frontendforever.com/admin/v1.php?action=loginUsingPassword', 
        new URLSearchParams(data).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      if (response.data.data.email === email) {
        // Authentication successful, store the token if needed
        const authToken = response.data.data.token; // Assuming the token is in the response data
        localStorage.setItem('token', authToken);
        localStorage.setItem('aemail',email);
        history.push('/admin/owners');
      } else {
        // Handle authentication error (e.g., display an error message)
        console.log('Authentication failed');
      }
    } catch (error) {
      // Handle any network or unexpected errors here
      console.error('An error occurred:', error);
    }
  };
  
 

  // Inside your SignIn component


  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
  
    <Flex
    maxW={{ base: "100%", md: "max-content" }}
    w="100%"
    mx="auto"
    minH="100vh" // Changed to minH to ensure full height
    alignItems="center" // Center vertically
    justifyContent="center" // Center horizontally
    px={{ base: "25px", md: "0px" }}
    flexDirection="column"
  >
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <Flex align='center' mb='25px'>
          </Flex>
          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
            isRequired={true}
            variant='auth'
            fontSize='sm'
            ms={{ base: "0px", md: "0px" }}
            type='email'
            placeholder='mail@simmmple.com'
            mb='24px'
            fontWeight='500'
            size='lg'
            value={email} // Bind the value of the email input to the email state
            onChange={(e) => setEmail(e.target.value)} // Update the email state on change
          />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
            <Input
            isRequired={true}
            fontSize='sm'
            placeholder='Min. 8 characters'
            mb='24px'
            size='lg'
            type={show ? "text" : "password"}
            variant='auth'
            value={password} // Bind the value of the password input to the password state
            onChange={(e) => setPassword(e.target.value)} // Update the password state on change
          />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent='space-between' align='center' mb='24px'>
              <FormControl display='flex' alignItems='center'>
                <Checkbox
                  id='remember-login'
                  colorScheme='brandScheme'
                  me='10px'
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  fontWeight='normal'
                  color={textColor}
                  fontSize='sm'>
                  Keep me logged in
                </FormLabel>
              </FormControl>
              <NavLink to='/auth/forgot-password'>
                <Text
                  color={textColorBrand}
                  fontSize='sm'
                  w='124px'
                  fontWeight='500'>
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
        fontSize='sm'
        variant='brand'
        fontWeight='500'
        w='100%'
        h='50'
        mb='24px'
        onClick={handleSignIn} // Call handleSignIn when the button is clicked
      >
              Sign In
            </Button>
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
          </Flex>
        </Flex>
      </Flex>

  );
}

export default SignIn;

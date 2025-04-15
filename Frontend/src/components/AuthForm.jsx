import { Formik, Form, Field } from 'formik';
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Heading,
  Text,
  Box,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const AuthForm = ({ 
  isLogin, 
  validationSchema, 
  initialValues, 
  onSubmit, 
  isLoading 
}) => {
  return (
    <Box 
      maxW="md" 
      mx="auto" 
      mt={8} 
      p={6} 
      borderWidth={1} 
      borderRadius="lg" 
      boxShadow="lg"
    >
      <Heading mb={6} textAlign="center">
        {isLogin ? 'Login' : 'Sign Up'}
      </Heading>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Stack spacing={4}>
              {!isLogin && (
                <Field name="username">
                  {({ field }) => (
                    <FormControl isInvalid={errors.username && touched.username}>
                      <FormLabel>Username</FormLabel>
                      <Input {...field} placeholder="Username" />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              )}
              
              <Field name="email">
                {({ field }) => (
                  <FormControl isInvalid={errors.email && touched.email}>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type="email" placeholder="Email" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              
              <Field name="password">
                {({ field }) => (
                  <FormControl isInvalid={errors.password && touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Input {...field} type="password" placeholder="Password" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              
              <Button
                mt={4}
                colorScheme="blue"
                isLoading={isLoading}
                type="submit"
                width="full"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      
      <Text mt={4} textAlign="center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <ChakraLink as={Link} to={isLogin ? "/signup" : "/login"} color="blue.500">
          {isLogin ? "Sign Up" : "Login"}
        </ChakraLink>
      </Text>
    </Box>
  );
};

export default AuthForm;
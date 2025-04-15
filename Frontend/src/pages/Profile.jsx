import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  VStack,
  Divider,
  Text,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';

import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { updateUserProfile } from '../services/userService';
import { profileSchema } from '../utils/Validation';
import { formatCurrency } from '../utils/Formatters';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initial form values from current user data
  const initialValues = {
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '', // Password field starts empty for security
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setUpdateSuccess(false);
    
    try {
      // Only include password in the update if it was provided
      const userData = {
        username: values.username,
        email: values.email,
        ...(values.password && { password: values.password }),
      };

      await updateUserProfile(userData);
      showSuccess('Profile updated successfully!');
      setUpdateSuccess(true);
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={2}>Your Profile</Heading>
        <Text color="gray.600">
          Manage your account information and see your savings statistics.
        </Text>
      </Box>

      {/* User Stats */}
      <Box mb={8}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
            <StatLabel fontSize="md">Total Contributions</StatLabel>
            <StatNumber fontSize="2xl">{formatCurrency(currentUser?.total_contributions || 0)}</StatNumber>
          </Stat>
          
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
            <StatLabel fontSize="md">Active Groups</StatLabel>
            <StatNumber fontSize="2xl">{currentUser?.active_groups || 0}</StatNumber>
          </Stat>
          
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
            <StatLabel fontSize="md">Member Since</StatLabel>
            <StatNumber fontSize="2xl">
              {new Date(currentUser?.created_at).toLocaleDateString() || 'N/A'}
            </StatNumber>
          </Stat>
        </SimpleGrid>
      </Box>

      {/* Profile Form */}
      <Box 
        p={6} 
        borderWidth="1px" 
        borderRadius="lg" 
        boxShadow="md" 
        bg="white"
      >
        <VStack spacing={4} align="center" mb={6}>
          <Avatar 
            size='2xl' 
            name={currentUser?.username} 
            bg="blue.500"
          />
          <Text fontSize="lg" fontWeight="bold">
            {currentUser?.username}
          </Text>
        </VStack>

        {updateSuccess && (
          <Alert status="success" mb={6} borderRadius="md">
            <AlertIcon />
            <AlertDescription>Your profile has been updated successfully!</AlertDescription>
          </Alert>
        )}

        <Divider mb={6} />

        <Formik
          initialValues={initialValues}
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <VStack spacing={4} align="start">
                <Field name="username">
                  {({ field }) => (
                    <FormControl isInvalid={errors.username && touched.username}>
                      <FormLabel>Username</FormLabel>
                      <Input {...field} placeholder="Username" />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

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
                      <FormLabel>New Password (leave blank to keep current)</FormLabel>
                      <Input {...field} type="password" placeholder="New Password" />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Box pt={4} width="100%">
                  <Button 
                    colorScheme="blue" 
                    type="submit" 
                    isLoading={isSubmitting}
                    width="full"
                  >
                    Update Profile
                  </Button>
                </Box>
              </VStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Profile;
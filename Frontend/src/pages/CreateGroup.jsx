import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  VStack,
  Divider,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';

import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { createGroup } from '../services/groupService';
import { groupSchema } from '../utils/Validation';

const CreateGroup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Initial form values
  const initialValues = {
    name: '',
    description: '',
    target_amount: '',
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const groupData = {
        name: values.name,
        description: values.description,
        target_amount: parseFloat(values.target_amount),
      };

      const response = await createGroup(groupData);
      showSuccess('Group created successfully!');
      
      // Navigate to the newly created group's detail page
      navigate(`/groups/${response.id}`);
    } catch (error) {
      showError(error.message || 'Failed to create group');
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={2}>Create New Savings Group</Heading>
        <Text color="gray.600">
          Start a new group to save together with friends, family, or colleagues.
        </Text>
      </Box>

      <Box 
        p={6} 
        borderWidth="1px" 
        borderRadius="lg" 
        boxShadow="md" 
        bg="white"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={groupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <VStack spacing={4} align="start">
                <Field name="name">
                  {({ field }) => (
                    <FormControl isInvalid={errors.name && touched.name}>
                      <FormLabel>Group Name</FormLabel>
                      <Input 
                        {...field} 
                        placeholder="Enter a name for your savings group" 
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="description">
                  {({ field }) => (
                    <FormControl isInvalid={errors.description && touched.description}>
                      <FormLabel>Description</FormLabel>
                      <Textarea 
                        {...field} 
                        placeholder="Describe the purpose of this savings group" 
                        rows={4}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="target_amount">
                  {({ field }) => (
                    <FormControl isInvalid={errors.target_amount && touched.target_amount}>
                      <FormLabel>Target Amount ($)</FormLabel>
                      <NumberInput
                        min={1}
                        precision={2}
                        step={10}
                        onChange={(valueString) => field.onChange({
                          target: { name: field.name, value: valueString }
                        })}
                        value={field.value}
                      >
                        <NumberInputField 
                          name={field.name}
                          placeholder="0.00" 
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.target_amount}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Divider my={4} />

                <Text fontSize="sm" color="gray.600">
                  As the creator, you'll automatically be the admin of this group. You can invite others to join after creation.
                </Text>

                <Box pt={4} width="100%">
                  <Button 
                    colorScheme="blue" 
                    type="submit" 
                    isLoading={isSubmitting}
                    width="full"
                  >
                    Create Group
                  </Button>
                  <Button
                    mt={3}
                    variant="outline"
                    width="full"
                    onClick={() => navigate('/')}
                  >
                    Cancel
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

export default CreateGroup;
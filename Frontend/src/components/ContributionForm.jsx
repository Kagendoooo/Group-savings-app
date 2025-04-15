import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { contributionSchema } from '../utils/Validation';
import { createContribution } from '../services/transactionService';
import { useNotification } from '../contexts/NotificationContext';

const ContributionForm = ({ groupId, onContributionSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    amount: '',
    description: '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const contributionData = {
        group_id: groupId,
        amount: parseFloat(values.amount),
        description: values.description,
        type: 'contribution',
      };

      await createContribution(contributionData);
      showSuccess('Contribution successful!');
      resetForm();
      onClose();
      
      if (onContributionSuccess) {
        onContributionSuccess();
      }
    } catch (error) {
      showError(error.message || 'Failed to process contribution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Make Contribution
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Make a Contribution</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={initialValues}
              validationSchema={contributionSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field name="amount">
                    {({ field }) => (
                      <FormControl isInvalid={errors.amount && touched.amount} mb={4}>
                        <FormLabel>Amount ($)</FormLabel>
                        <Input {...field} type="number" step="0.01" placeholder="0.00" />
                        <FormErrorMessage>{errors.amount}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="description">
                    {({ field }) => (
                      <FormControl isInvalid={errors.description && touched.description}>
                        <FormLabel>Description (Optional)</FormLabel>
                        <Textarea {...field} placeholder="Add a note about your contribution" />
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              isLoading={isSubmitting}
              onClick={() => {
                // Trigger form submission
                const submitBtn = document.querySelector('form button[type="submit"]');
                if (submitBtn) submitBtn.click();
              }}
            >
              Contribute
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ContributionForm;
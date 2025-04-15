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
import * as Yup from 'yup';
import { requestWithdrawal } from '../services/transactionService';
import { useNotification } from '../contexts/NotificationContext';

const withdrawalSchema = Yup.object({
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  reason: Yup.string()
    .required('Reason for withdrawal is required'),
});

const WithdrawalForm = ({ groupId, availableBalance, onWithdrawalSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    amount: '',
    reason: '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const withdrawalData = {
        group_id: groupId,
        amount: parseFloat(values.amount),
        reason: values.reason,
      };

      await requestWithdrawal(withdrawalData);
      showSuccess('Withdrawal request submitted successfully!');
      resetForm();
      onClose();
      
      if (onWithdrawalSuccess) {
        onWithdrawalSuccess();
      }
    } catch (error) {
      showError(error.message || 'Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button colorScheme="orange" onClick={onOpen}>
        Request Withdrawal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request a Withdrawal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={initialValues}
              validationSchema={withdrawalSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values }) => (
                <Form>
                  <Field name="amount">
                    {({ field }) => (
                      <FormControl isInvalid={errors.amount && touched.amount} mb={4}>
                        <FormLabel>Amount ($)</FormLabel>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          max={availableBalance}
                        />
                        <FormErrorMessage>
                          {errors.amount || 
                            (parseFloat(values.amount) > availableBalance ? 
                              `Cannot withdraw more than available balance ($${availableBalance})` : '')}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="reason">
                    {({ field }) => (
                      <FormControl isInvalid={errors.reason && touched.reason}>
                        <FormLabel>Reason for Withdrawal</FormLabel>
                        <Textarea {...field} placeholder="Please explain why you need to withdraw" />
                        <FormErrorMessage>{errors.reason}</FormErrorMessage>
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
              colorScheme="orange" 
              isLoading={isSubmitting}
              onClick={() => {
                const submitBtn = document.querySelector('form button[type="submit"]');
                if (submitBtn) submitBtn.click();
              }}
            >
              Submit Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WithdrawalForm;
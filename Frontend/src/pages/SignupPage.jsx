import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Heading } from '@chakra-ui/react';
import AuthForm from '../components/AuthForm';
import { registerSchema } from '../utils/Validation';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser, isAuthenticated, error: authError } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Initial form values
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await registerUser(values);
      showSuccess('Account created successfully!');
      // Redirect handled by the useEffect above when isAuthenticated changes
    } catch (error) {
      showError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading>Create an Account</Heading>
      </Box>
      
      <AuthForm
        isLogin={false}
        validationSchema={registerSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default SignupPage;
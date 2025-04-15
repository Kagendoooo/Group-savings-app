import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Heading } from '@chakra-ui/react';
import AuthForm from '../components/AuthForm';
import { loginSchema } from '../utils/Validation';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser, isAuthenticated, error: authError } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await loginUser(values);
      // Redirect handled by the useEffect above when isAuthenticated changes
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box textAlign="center" mb={8}>
        <Heading>Welcome to Group Savings App</Heading>
      </Box>
      
      <AuthForm
        isLogin={true}
        validationSchema={loginSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default LoginPage;
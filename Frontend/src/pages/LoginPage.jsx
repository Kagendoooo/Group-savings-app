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
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();

  // 🔁 Redirect if already logged in
  useEffect(() => {
    console.log('Authentication status:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, actions) => {
    setIsLoading(true);
    try {
      await loginUser(values);
      showSuccess('Login successful!');
      // ⏳ Navigation is handled by the useEffect once isAuthenticated updates
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
      actions.setSubmitting(false); // Stops Formik loading spinner
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
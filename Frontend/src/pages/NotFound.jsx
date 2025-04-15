import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxW="container.md" py={16}>
      <VStack spacing={8} textAlign="center">
        <Heading size="2xl" color="blue.500">404</Heading>
        <Heading size="xl">Page Not Found</Heading>
        <Text fontSize="lg" color="gray.600">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Box>
          <Button 
            as={RouterLink} 
            to="/" 
            colorScheme="blue" 
            size="lg"
          >
            Return to Dashboard
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default NotFound;
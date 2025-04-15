import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Center py={10}>
      <VStack spacing={3}>
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text color="gray.500">{message}</Text>
      </VStack>
    </Center>
  );
};

export default LoadingSpinner;
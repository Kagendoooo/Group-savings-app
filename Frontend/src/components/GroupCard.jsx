import { Box, Heading, Text, Button, VStack, HStack, Badge } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { formatCurrency } from '../utils/Formatters';

const GroupCard = ({ group }) => {
  const {
    id,
    name,
    description,
    current_amount,
    target_amount,
    progress,
  } = group;

  // Format the description to limit length
  const shortDescription = description?.length > 100
    ? `${description.substring(0, 100)}...`
    : description;

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      width="100%"
      bg="white"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <VStack align="start" spacing={3}>
        <Heading size="md">{name}</Heading>
        
        {shortDescription && (
          <Text color="gray.600" noOfLines={2}>
            {shortDescription}
          </Text>
        )}
        
        <HStack width="100%" justify="space-between">
          <Text fontWeight="bold">
            {formatCurrency(current_amount)} / {formatCurrency(target_amount)}
          </Text>
          <Badge colorScheme={progress >= 100 ? 'green' : 'blue'}>
            {progress}%
          </Badge>
        </HStack>
        
        <ProgressBar value={progress} />
        
        <Button
          as={RouterLink}
          to={`/groups/${id}`}
          colorScheme="blue"
          width="100%"
        >
          View Details
        </Button>
      </VStack>
    </Box>
  );
};

export default GroupCard;
import { SimpleGrid, Text, Center, Spinner } from '@chakra-ui/react';
import GroupCard from './GroupCard';

const GroupList = ({ groups, isLoading, error }) => {
  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Center py={10}>
        <Text fontSize="lg" color="gray.500">
          No savings groups found.
        </Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </SimpleGrid>
  );
};

export default GroupList;
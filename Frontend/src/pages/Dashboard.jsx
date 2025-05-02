import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Text, 
  Flex, 
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserGroups } from '../services/groupService';
import { useNotification } from '../contexts/NotificationContext';
import GroupList from '../components/GroupList';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/Formatters';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalSavings: 0,
    contributionsThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { showError } = useNotification();
  const statBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const data = await getUserGroups();
        setGroups(groups);
        
        const totalGroups = groups.length;
        const totalSavings = groups.reduce((sum, group) => sum + parseFloat(group.current_amount || 0), 0);
        
        // No contributionsThisMonth yet – placeholder
        const contributionsThisMonth = 0;
        
        setStats({
          totalGroups,
          totalSavings,
          contributionsThisMonth,
        });
        
      } catch (error) {
        showError('Failed to load your savings groups');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [showError]);

  if (isLoading) {
    return <LoadingSpinner message="Loading your savings groups..." />;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Welcome, {currentUser?.username || 'User'}!</Heading>
          <Button 
            as={RouterLink} 
            to="/create-group" 
            colorScheme="blue"
          >
            Create New Group
          </Button>
        </Flex>

        <StatGroup mb={8}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} width="100%">
            <Stat 
              p={5} 
              shadow="md" 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="lg"
              bg={statBgColor}
            >
              <StatLabel fontSize="md">Total Groups</StatLabel>
              <StatNumber fontSize="3xl">{stats.totalGroups}</StatNumber>
            </Stat>
            <Stat 
              p={5} 
              shadow="md" 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="lg"
              bg={statBgColor}
            >
              <StatLabel fontSize="md">Total Savings</StatLabel>
              <StatNumber fontSize="3xl">{formatCurrency(stats.totalSavings)}</StatNumber>
            </Stat>
            <Stat 
              p={5} 
              shadow="md" 
              border="1px" 
              borderColor="gray.200" 
              borderRadius="lg"
              bg={statBgColor}
            >
              <StatLabel fontSize="md">Contributions This Month</StatLabel>
              <StatNumber fontSize="3xl">{formatCurrency(stats.contributionsThisMonth)}</StatNumber>
            </Stat>
          </SimpleGrid>
        </StatGroup>

        <Box mb={6}>
          <Heading size="md" mb={4}>Your Savings Groups</Heading>
          <GroupList 
            groups={groups} 
            isLoading={isLoading} 
            error={error} 
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Badge,
  Divider,
  HStack,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { getGroupById, joinGroup, leaveGroup } from '../services/groupService';
import { getGroupTransactions } from '../services/transactionService';

import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import TransactionList from '../components/TransactionList';
import ContributionForm from '../components/ContributionForm';
import WithdrawalForm from '../components/WithdrawalForm';

import { formatCurrency, formatDate } from '../utils/Formatters';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [group, setGroup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Fetch group details and check membership
  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getGroupById(groupId);
        setGroup(data);
        
        // Check if current user is a member
        const memberIds = data.members?.map(member => member.id) || [];
        setIsMember(memberIds.includes(currentUser?.id));
        
        // Check if current user is admin
        setIsAdmin(data.admin_id === currentUser?.id);
      } catch (error) {
        showError('Failed to load group details');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId, currentUser, showError]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!group) return;
      
      setIsTransactionsLoading(true);
      try {
        const data = await getGroupTransactions(groupId);
        setTransactions(data.transactions || []);
      } catch (error) {
        showError('Failed to load transactions');
      } finally {
        setIsTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [group, groupId, showError]);

  // Handle join group
  const handleJoinGroup = async () => {
    try {
      await joinGroup(groupId);
      showSuccess('You have successfully joined this group!');
      setIsMember(true);
      // Refresh group data to update members list
      const updatedGroup = await getGroupById(groupId);
      setGroup(updatedGroup);
    } catch (error) {
      showError(error.message || 'Failed to join group');
    }
  };

  // Handle leave group
  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupId);
      showSuccess('You have left this group');
      setIsMember(false);
      // Refresh group data to update members list
      const updatedGroup = await getGroupById(groupId);
      setGroup(updatedGroup);
    } catch (error) {
      showError(error.message || 'Failed to leave group');
    }
  };

  // Handle confirmation dialog
  const openConfirmDialog = (action) => {
    setConfirmAction(action);
    onConfirmOpen();
  };

  const handleConfirmAction = async () => {
    if (confirmAction === 'leave') {
      await handleLeaveGroup();
    }
    onConfirmClose();
  };

  // Handle reload data after contribution or withdrawal
  const handleTransactionSuccess = async () => {
    try {
      const [updatedGroup, updatedTransactions] = await Promise.all([
        getGroupById(groupId),
        getGroupTransactions(groupId)
      ]);
      
      setGroup(updatedGroup);
      setTransactions(updatedTransactions.transactions || []);
    } catch (error) {
      showError('Failed to refresh data');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading group details..." />;
  }

  if (error || !group) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text color="red.500">
          {error || 'Group not found'}
        </Text>
        <Button mt={4} onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Box>
            <Heading size="lg">{group.name}</Heading>
            <Text color="gray.600">Created on {formatDate(group.created_at)}</Text>
          </Box>
          <HStack>
            {!isMember && (
              <Button colorScheme="blue" onClick={handleJoinGroup}>
                Join Group
              </Button>
            )}
            {isMember && !isAdmin && (
              <Button colorScheme="red" variant="outline" onClick={() => openConfirmDialog('leave')}>
                Leave Group
              </Button>
            )}
            {isAdmin && (
              <Button
                colorScheme="teal"
                onClick={() => navigate(`/edit-group/${groupId}`)}
              >
                Edit Group
              </Button>
            )}
          </HStack>
        </Flex>

        {/* Group Description */}
        <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="white">
          <Heading size="sm" mb={2}>Description</Heading>
          <Text>{group.description || 'No description provided.'}</Text>
        </Box>

        {/* Group Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
            <StatLabel fontSize="md">Current Amount</StatLabel>
            <StatNumber fontSize="2xl">{formatCurrency(group.current_amount)}</StatNumber>
          </Stat>
          
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
            <StatLabel fontSize="md">Target Amount</StatLabel>
            <StatNumber fontSize="2xl">{formatCurrency(group.target_amount)}</StatNumber>
          </Stat>
          
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
            <StatLabel fontSize="md">Members</StatLabel>
            <StatNumber fontSize="2xl">{group.members?.length || 0}</StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Progress Bar */}
        <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="white">
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Savings Progress</Text>
            <Badge colorScheme={group.progress >= 100 ? 'green' : 'blue'}>
              {group.progress}%
            </Badge>
          </Flex>
          <ProgressBar value={group.progress} />
        </Box>

        {/* Action Buttons */}
        {isMember && (
          <Flex mb={6} gap={4} justifyContent="center">
            <ContributionForm 
              groupId={groupId} 
              onContributionSuccess={handleTransactionSuccess} 
            />
            <WithdrawalForm 
              groupId={groupId} 
              availableBalance={group.current_amount} 
              onWithdrawalSuccess={handleTransactionSuccess} 
            />
          </Flex>
        )}

        {/* Members List */}
        <Box mb={6} p={4} borderWidth="1px" borderRadius="md" bg="white">
          <Heading size="md" mb={4}>Members</Heading>
          {group.members && group.members.length > 0 ? (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {group.members.map(member => (
                <Box 
                  key={member.id} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md"
                  bg={member.id === group.admin_id ? "blue.50" : "gray.50"}
                >
                  <Text fontWeight={member.id === group.admin_id ? "bold" : "normal"}>
                    {member.username}
                    {member.id === group.admin_id && (
                      <Badge ml={2} colorScheme="blue">Admin</Badge>
                    )}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Text color="gray.500">No members in this group yet.</Text>
          )}
        </Box>

        {/* Transactions List */}
        <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
          <TransactionList 
            transactions={transactions} 
            isLoading={isTransactionsLoading} 
            error={null} 
          />
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {confirmAction === 'leave' && (
              <Text>Are you sure you want to leave this group? You can rejoin later if you wish.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleConfirmAction}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default GroupDetail;

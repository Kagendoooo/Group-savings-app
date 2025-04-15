import { 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    TableContainer,
    Badge,
    Text,
    Box, 
    Heading,
    Center,
    Spinner,
  } from '@chakra-ui/react';
  import { formatCurrency, formatDate } from '../utils/Formatters';
  
  const TransactionList = ({ transactions, isLoading, error }) => {
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
  
    if (!transactions || transactions.length === 0) {
      return (
        <Box py={4}>
          <Text fontSize="lg" color="gray.500" textAlign="center">
            No transactions found.
          </Text>
        </Box>
      );
    }
  
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'completed':
        case 'approved':
          return 'green';
        case 'pending':
          return 'yellow';
        case 'rejected':
          return 'red';
        default:
          return 'gray';
      }
    };
  
    const getTransactionTypeColor = (type) => {
      switch (type.toLowerCase()) {
        case 'contribution':
          return 'green';
        case 'withdrawal':
          return 'orange';
        default:
          return 'gray';
      }
    };
  
    return (
      <Box>
        <Heading size="md" mb={4}>Transactions</Heading>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>User</Th>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>Description</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{formatDate(transaction.created_at)}</Td>
                  <Td>{transaction.user?.username || 'Unknown'}</Td>
                  <Td>
                    <Badge colorScheme={getTransactionTypeColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </Td>
                  <Td>{formatCurrency(transaction.amount)}</Td>
                  <Td>{transaction.description || transaction.reason || '-'}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  
  export default TransactionList;  
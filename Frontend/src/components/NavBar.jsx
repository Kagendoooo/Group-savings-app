import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Stack,
  Link,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', auth: true },
    { name: 'Create Group', path: '/create-group', auth: true },
    { name: 'Profile', path: '/profile', auth: true },
  ];

  return (
    <Box bg="blue.500" px={4} boxShadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Box>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Text fontSize="xl" fontWeight="bold" color="white">
                Group Savings App
              </Text>
            </Link>
          </Box>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {menuItems.map((item) => (
              (!item.auth || isAuthenticated) && (
                <Link
                  key={item.name}
                  as={RouterLink}
                  to={item.path}
                  px={2}
                  py={1}
                  rounded="md"
                  color="white"
                  _hover={{
                    textDecoration: 'none',
                    bg: 'blue.600',
                  }}
                >
                  {item.name}
                </Link>
              )
            ))}
          </HStack>
        </HStack>
        <Flex alignItems="center">
          {isAuthenticated ? (
            <Menu>
              <MenuButton as={Button} colorScheme="blue">
                {currentUser?.username || 'Account'}
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button as={RouterLink} to="/login" colorScheme="blue" variant="outline">
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
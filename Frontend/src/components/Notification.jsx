import { useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from '@chakra-ui/react';

const Notification = ({ 
  status = 'info', 
  title, 
  description, 
  isVisible, 
  onClose,
  autoHideDuration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!isVisible) return null;

  return (
    <Box 
      position="fixed" 
      top="20px" 
      right="20px" 
      zIndex="toast"
      maxWidth="400px"
    >
      <Alert 
        status={status} 
        variant="solid" 
        borderRadius="md"
        boxShadow="md"
      >
        <AlertIcon />
        {title && <AlertTitle mr={2}>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
        <CloseButton 
          position="absolute"
          right="8px"
          top="8px"
          onClick={onClose}
        />
      </Alert>
    </Box>
  );
};

export default Notification;